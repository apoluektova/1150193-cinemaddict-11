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
import {render, RenderPosition, remove} from "./utils/render.js";

const AUTHORIZATION = `Basic asClkjaldhfsoklnQN`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const apiWithProvider = new Provider(api);
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
     render(siteMainElement, new NoFilmsComponent(), RenderPosition.BEFOREEND);
   });
