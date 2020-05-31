import API from "./api/index.js";
import FilmsComponent from "./components/films.js";
import FilmsModel from "./models/films.js";
import FilterController from "./controllers/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import LoadingComponent from "./components/loading.js";
import NoFilmsComponent from "./components/no-films.js";
import PageController from "./controllers/page-controller.js";
import Provider from "./api/provider.js";
import SortingComponent from "./components/sorting.js";
import StatisticsComponent from "./components/statistics.js";
import Store from "./api/store.js";
import {render, RenderPosition, remove} from "./utils/render.js";

const AUTHORIZATION = `Basic asClkldhfsoklnQNa`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel();
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer__statistics`);
const loadingComponent = new LoadingComponent();
const filterController = new FilterController(siteMainElement, filmsModel);
const sortComponent = new SortingComponent();
const filmsContainer = new FilmsComponent();
const filmsController = new PageController(filmsContainer, filmsModel, apiWithProvider);
const statisticsComponent = new StatisticsComponent(filmsModel.getFilmsAll());

filterController.render();

render(siteMainElement, sortComponent, RenderPosition.BEFOREEND);
render(siteMainElement, loadingComponent, RenderPosition.BEFOREEND);
render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);


render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

filterController.setOnMenuItemClick((menuItem) => {
  if (menuItem === `stats`) {
    filmsController.hide();
    statisticsComponent.show(filmsModel.getFilmsAll());
  } else {
    filmsController.show();
    statisticsComponent.hide();
  }
});

apiWithProvider.getFilms()
   .then((films) => {
     remove(loadingComponent);
     filmsModel.setFilms(films);
     remove(sortComponent);
     filmsController.render();
     render(siteFooterElement, new FooterStatisticsComponent(films), RenderPosition.BEFOREEND);
   })
   .catch(() => {
     remove(loadingComponent);
     render(filmsContainer.getElement().querySelector(`.films-list`), new NoFilmsComponent(), RenderPosition.BEFOREEND);
   });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
      .then(() => {
      }).catch(() => {
      });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title = document.title.concat(` [offline]`);
});
