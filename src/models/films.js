import {FilterType} from "../const.js";
import {getFilmsByFilter} from "../utils/filter.js";

const EXTRA_CARDS_AMOUNT = 2;

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilms() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getFilmsAll() {
    return this._films;
  }

  getTopRatedFilms() {
    return [...this._films]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, EXTRA_CARDS_AMOUNT);
  }

  getMostCommentedFilms() {
    return [...this._films]
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_CARDS_AMOUNT);
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((filmItem) => filmItem.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setOnFilterChange(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setOnDataChange(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
