import AbstractComponent from "./abstract-component.js";
import FilterComponent from "./filter.js";
import {FilterType} from "../const.js";

const LINK_TAG_NAME = `A`;

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

  setOnFilterChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const siblingsElements = Array.from(evt.target.parentNode.children);

      if (evt.target.tagName !== LINK_TAG_NAME) {
        return;
      }

      const filterType = evt.target.dataset.filterType;

      if (this._currentFilter === filterType) {
        return;
      }

      siblingsElements.forEach((element) => {
        element.classList.remove(`main-navigation__item--active`);
      });

      evt.target.classList.add(`main-navigation__item--active`);

      this._currentFilter = filterType;

      handler(this._currentFilter);
    });
  }

  setOnMenuItemClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const menuItems = this.getElement().querySelectorAll(`.main-navigation__item`);

      if (evt.target.classList.contains(`main-navigation__additional`)) {
        menuItems.forEach((item) => item.classList.remove(`main-navigation__item--active`));
      } else if (evt.target.classList.contains(`main-navigation__item`)) {
        this.getElement().querySelector(`.main-navigation__additional`).classList.remove(`main-navigation__item--active`);
      }

      const menuLink = evt.target.getAttribute(`href`);
      if (!menuLink) {
        return;
      }

      const menuItem = menuLink.split(`#`)[1];

      handler(menuItem);
    });
  }
}
