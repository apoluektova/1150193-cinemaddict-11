import MainNavigationComponent from "../components/main-navigation.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._mainNavigationComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setOnMenuItemClick = this.setOnMenuItemClick.bind(this);

    this._filmsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilmsAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._mainNavigationComponent;

    this._mainNavigationComponent = new MainNavigationComponent(filters);
    this._mainNavigationComponent.setFilterChangeHandler(this._onFilterChange);

    if (this._onMenuItemClick) {
      this._mainNavigationComponent.setOnMenuItemClick(this._onMenuItemClick);
    }

    if (oldComponent) {
      replace(this._mainNavigationComponent, oldComponent);
    } else {
      render(container, this._mainNavigationComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._filmsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }

  setOnMenuItemClick(handler) {
    this._mainNavigationComponent.setOnMenuItemClick(handler);

    this._onMenuItemClick = handler;
  }
}

