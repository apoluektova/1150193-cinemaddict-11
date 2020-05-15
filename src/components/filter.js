import AbstractComponent from "./abstract-component.js";

const createFilterMarkup = (filter, isActive) => {
  const {name, count} = filter;
  const filterId = name.toLowerCase();
  const filterActiveClass = isActive ? `main-navigation__item--active` : ``;

  return (
    `<a data-filter-type="${name}" href="#${name === `All movies` ? `all` : filterId}" class="main-navigation__item 
    ${filterActiveClass}">${name}${name === `All movies` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.checked)).join(`\n`);

  return (
    ` <div class="main-navigation__items">
        ${filtersMarkup}
      </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }
}
