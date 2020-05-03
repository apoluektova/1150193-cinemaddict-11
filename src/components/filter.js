import AbstractComponent from "./abstract-component.js";
import {FilterType} from "../const.js";

const createFilterMarkup = (filter, isActive) => {
  const {name, count} = filter;
  const filterId = name.toLowerCase();
  const filterActiveClass = isActive ? `main-navigation__item--active` : ``;

  return (
    `<a data-filter-type="${name}" href="#${name === `All movies` ? `all` : filterId}" class="main-navigation__item 
    ${filterActiveClass}">${name}${name === `All movies` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createNavigationTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
    this._currentFilter = FilterType.ALL;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const siblingsElements = Array.from(evt.target.parentNode.children);

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterType = evt.target.dataset.filterType;

      if (this._currentFilter === filterType) {
        return;
      }

      siblingsElements.forEach((el) => {
        el.classList.remove(`main-navigation__item--active`);
      });

      evt.target.classList.add(`main-navigation__item--active`);

      this._currentFilter = filterType;

      handler(this._currentFilter);
    });
  }
}
