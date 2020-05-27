import ExtraFilmsComponent from "../components/extra-films.js";
import FilmsListComponent from "../components/films-list.js";
import MovieController from "./movie-controller.js";
import NoFilmsComponent from "../components/no-films.js";
import ProfileRatingComponent from "../components/profile-rating.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getDateFromString} from "../utils/common.js";

const Cards = {
  SHOWN: 5,
  BY_BUTTON: 5,
  EXTRA: 2,
};

const siteHeaderElement = document.querySelector(`.header`);

const renderFilmCards = (filmsListElement, films, onDataChange, onViewChange, api, filmsModel) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsListElement, onDataChange, onViewChange, api, filmsModel);

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
    case SortType.COMMENTS:
      sortedFilms = shownFilms.sort((a, b) => b.comments.length - a.comments.length);
      break;
    case SortType.DEFAULT:
      sortedFilms = shownFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._showedMovieControllers = [];
    this._filmsListComponent = new FilmsListComponent();
    this._sortComponent = new SortingComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._topRatedFilmsComponent = new ExtraFilmsComponent(`Top Rated`);
    this._mostCommentedFilmsComponent = new ExtraFilmsComponent(`Most Commented`);
    this._shownFilmsCount = Cards.SHOWN;
    this._filmsListElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setOnTypeChange(this._onSortTypeChange);
    this._filmsModel.setOnFilterChange(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.getItems();

    if (films.length === 0) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._profileRatingComponent = new ProfileRatingComponent(films);
    render(siteHeaderElement, this._profileRatingComponent, RenderPosition.BEFOREEND);

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderFilms(films.slice(0, this._shownFilmsCount));

    this._renderShowMoreButton();
    this._renderTopRatedFilms(films);
    this._renderMostCommentedFilms(films);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  _onShowMoreButtonClick(films) {
    const prevFilmsCount = this._shownFilmsCount;
    this._shownFilmsCount = this._shownFilmsCount + Cards.BY_BUTTON;
    films = this._filmsModel.getItems();

    const sortedFilmCards = getSortedFilmCards(films, this._sortComponent.getType(), prevFilmsCount, this._shownFilmsCount);
    const newFilmCards = renderFilmCards(this._filmsListElement, sortedFilmCards, this._onDataChange, this._onViewChange, this._api, this._filmsModel);

    this._showedMovieControllers = this._showedMovieControllers.concat(newFilmCards);

    if (this._shownFilmsCount >= films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._shownFilmsCount >= this._filmsModel.getItems().length) {
      return;
    }

    render(this._filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setOnClick(this._onShowMoreButtonClick);
  }

  _removeFilms() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _renderFilms(films) {
    const newFilmCards = renderFilmCards(this._filmsListElement, films, this._onDataChange, this._onViewChange, this._api, this._filmsModel);
    this._showedMovieControllers = this._showedMovieControllers.concat(newFilmCards);
    this._shownFilmsCount = this._showedMovieControllers.length;
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getAllItems().slice(0, count));
    this._renderShowMoreButton();
  }

  _onDataChange(movieController, oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
    .then((filmModel) => {
      const isSuccess = this._filmsModel.update(oldData.id, filmModel);

      if (isSuccess) {
        movieController.render(filmModel);

        remove(this._profileRatingComponent);
        this._profileRatingComponent = new ProfileRatingComponent(this._filmsModel.getAllItems());
        render(siteHeaderElement, this._profileRatingComponent, RenderPosition.BEFOREEND);
      }
    })
    .catch(() => {
      movieController.shake();
    });
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._shownFilmsCount = Cards.BY_BUTTON;

    const sortedFilmCards = getSortedFilmCards(this._filmsModel.getItems(), sortType, 0, this._shownFilmsCount);
    this._removeFilms();
    this._renderFilms(sortedFilmCards);

    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateFilms(Cards.SHOWN);
    this._sortComponent.reset();
  }

  _renderTopRatedFilms(films) {
    const container = this._container.getElement();
    render(container, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
    const topRatedFilmsContainer = this._topRatedFilmsComponent.getElement().querySelector(`.films-list__container`);
    const topRatedFilms = getSortedFilmCards(films, SortType.RATING, 0, Cards.EXTRA);
    renderFilmCards(topRatedFilmsContainer, topRatedFilms, this._onDataChange, this._onViewChange, this._api, this._filmsModel);
  }

  _renderMostCommentedFilms(films) {
    const container = this._container.getElement();
    render(container, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
    const mostCommentedFilmsContainer = this._mostCommentedFilmsComponent.getElement().querySelector(`.films-list__container`);
    const mostCommentedFilms = getSortedFilmCards(films, SortType.COMMENTS, 0, Cards.EXTRA);
    renderFilmCards(mostCommentedFilmsContainer, mostCommentedFilms, this._onDataChange, this._onViewChange, this._api, this._filmsModel);
  }
}
