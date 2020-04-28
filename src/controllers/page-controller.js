import FilmsListComponent from "../components/films-list.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import MovieController from "./movie-controller.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getDateFromString} from "../utils/common.js";

const Cards = {
  SHOWN: 5,
  BY_BUTTON: 5,
};

const renderFilmCards = (filmsListElement, films, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsListElement, onDataChange, onViewChange);

    movieController.render(film);

    return movieController;
  });
};

const getSortedFilmCards = (films, sortType, from, to) => {
  let sortedFilms = [];
  const shownFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = shownFilms.sort((a, b) => getDateFromString(b.releaseDate) - getDateFromString(a.releaseDate));
      break;
    case SortType.RATING:
      sortedFilms = shownFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = shownFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._films = [];
    this._showedMovieControllers = [];
    this._filmsListComponent = new FilmsListComponent();
    this._sortComponent = new SortingComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._shownFilmsCount = Cards.SHOWN;
    this._filmsListElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _showMore(films) {
    const prevFilmsCount = this._shownFilmsCount;
    this._shownFilmsCount = this._shownFilmsCount + Cards.BY_BUTTON;

    const sortedFilmCards = getSortedFilmCards(this._films, this._sortComponent.getSortType(), prevFilmsCount, this._shownFilmsCount);
    const newFilmCards = renderFilmCards(this._filmsListElement, sortedFilmCards, this._onDataCange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newFilmCards);

    if (this._shownFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._shownFilmsCount >= this._films.length) {
      return;
    }

    render(this._filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);
  }

  render(films) {
    this._films = films;
    const container = this._container.getElement();

    if (films.length === 0) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._filmsListComponent, RenderPosition.BEFOREEND);

    const newFilmCards = renderFilmCards(this._filmsListElement, this._films.slice(0, this._shownFilmsCount), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilmCards);

    this._renderShowMoreButton();

    this._showMoreButtonComponent.setClickHandler(() => {
      this._showMore(films);
    });
  }

  _onDataChange(oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));

    this._showedMovieControllers[index].render(this._films[index]);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._shownFilmsCount = Cards.BY_BUTTON;

    const sortedFilmCards = getSortedFilmCards(this._films, sortType, 0, this._shownFilmsCount);

    this._filmsListElement.innerHTML = ``;

    const newFilmCards = renderFilmCards(this._filmsListElement, sortedFilmCards, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = newFilmCards;

    this._renderShowMoreButton();
  }
}
