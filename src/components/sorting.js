import AbstractSmartComponent from "./abstract-smart-component.js";

const SortType = {
  DATE: `date`,
  RATING: `rating`,
  DEFAULT: `default`,
};

const LINK_TAG_NAME = `A`;

const createSortingTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sorting extends AbstractSmartComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
    this._onTypeChange = null;
  }

  getType() {
    return this._currentSortType;
  }

  recoveryListeners() {
    this.setOnTypeChange(this._onTypeChange);
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createSortingTemplate();
  }

  reset() {
    this._currentSortType = SortType.DEFAULT;
    this.rerender();
  }

  setOnTypeChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const siblingsElements = Array.from(evt.target.parentNode.parentNode.children);

      if (evt.target.tagName !== LINK_TAG_NAME) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }
      this._currentSortType = sortType;

      siblingsElements.forEach((element) => {
        element.firstElementChild.classList.remove(`sort__button--active`);
      });

      evt.target.classList.add(`sort__button--active`);

      handler(this._currentSortType);
    });

    this._onTypeChange = handler;
  }
}

export {SortType};
