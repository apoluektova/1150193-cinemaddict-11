import AbstractComponent from "./abstract-component.js";
import FilterComponent from "./filter.js";
import {FilterType} from "../const.js";


const createNavigationTemplate = (filters) => {
  const filterSection = new FilterComponent(filters).getTemplate();
  return (
    `<nav class="main-navigation">
    ${filterSection}
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends AbstractComponent {
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

  setOnMenuItemClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      // if (evt.target.classList.contains(`main-navigation__additional`)) {
      //   this.getElement().querySelector(`.main-navigation__item`).classList.remove(`main-navigation__item--active`);
      //   evt.target.classList.add(`main-navigation__additional--active`);
      // }

      const menuLink = evt.target.getAttribute(`href`);
      const menuItem = menuLink.split(`#`)[1];

      handler(menuItem);
    });
  }
}
