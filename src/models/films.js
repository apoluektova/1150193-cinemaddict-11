import {FilterType} from "../const.js";
import {getFilmsByFilter} from "../utils/filter.js";

export default class Films {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getItems() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getAllItems() {
    return this._films;
  }

  setItems(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  update(id, film) {
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
