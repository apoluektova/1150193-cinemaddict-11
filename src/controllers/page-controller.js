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
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

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
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  _onShowMoreButtonClick(films) {
    const prevFilmsCount = this._shownFilmsCount;
    this._shownFilmsCount = this._shownFilmsCount + Cards.BY_BUTTON;
    films = this._filmsModel.getFilms();

    const sortedFilmCards = getSortedFilmCards(films, this._sortComponent.getSortType(), prevFilmsCount, this._shownFilmsCount);
    const newFilmCards = renderFilmCards(this._filmsListElement, sortedFilmCards, this._onDataCange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newFilmCards);

    if (this._shownFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._shownFilmsCount >= this._filmsModel.getFilms().length) {
      return;
    }

    render(this._filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.getFilms();

    if (films.length === 0) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilms(films.slice(0, this._shownFilmsCount));

    this._renderShowMoreButton();
  }

  _removeFilms() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _renderFilms(films) {
    const newFilmCards = renderFilmCards(this._filmsListElement, films, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilmCards);
    this._shownFilmsCount = this._showedMovieControllers.length;
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      movieController.render(newData);
    }
  }

  // _onCommentsChange(movieController, newData) {
  //   const films = this._filmsModel.getFilms();
  //   const comment = films.comment;
  //   if (newData === null) {
  //     this._filmsModel.removeComment(comment.id);
  //     this._updateFilms(this._shownFilmsCount);
  //   } else {
  //     this._filmsModel.addComment(newData);
  //     movieController.render(newData);
  //   }
  // }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._shownFilmsCount = Cards.BY_BUTTON;

    const sortedFilmCards = getSortedFilmCards(this._filmsModel.getFilms(), sortType, 0, this._shownFilmsCount);
    this._removeFilms();
    this._renderFilms(sortedFilmCards);

    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateFilms(Cards.SHOWN);
  }
}
