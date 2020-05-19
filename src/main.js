import API from "./api.js";
import FilmsComponent from "./components/films.js";
import FilmsModel from "./models/films.js";
import FilterController from "./controllers/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import LoadingComponent from "./components/loading.js";
import PageController from "./controllers/page-controller.js";
import ProfileRatingComponent from "./components/profile-rating.js";
import StatisticsComponent from "./components/statistics.js";
import {render, RenderPosition, remove} from "./utils/render.js";

const AUTHORIZATION = `Basic asdlkjasoktnLFAasdnoqnv`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const Cards = {
  TOTAL: 20,
  EXTRA: 2,
};

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

const loadingComponent = new LoadingComponent();

const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();

render(siteMainElement, loadingComponent, RenderPosition.BEFOREEND);

const filmsContainer = new FilmsComponent();
const filmsController = new PageController(filmsContainer, filmsModel, api);

render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);

const statisticsComponent = new StatisticsComponent(filmsModel.getFilmsAll());
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

// const topRatedController = new ExtraFilmsController(filmsContainer, `Top Rated`);
// const mostCommentedController = new ExtraFilmsController(filmsContainer, `Most Commented`);
// const extraFilmCards = generateFilms(Cards.EXTRA);

// if (films.length !== 0) {
//   topRatedController.renderExtraFilms(extraFilmCards);
//   mostCommentedController.renderExtraFilms(extraFilmCards);
// }

const siteFooter = document.querySelector(`.footer`);
// if (filmsModel.getFilmsAll().length !== 0) {
//   render(siteFooter, new FooterStatisticsComponent(filmsModel.getFilmsAll()), RenderPosition.BEFOREEND);
// } else {
//   render(siteFooter, new FooterStatisticsComponent(0), RenderPosition.BEFOREEND);
// }

api.getFilms()
   .then((films) => {
     remove(loadingComponent);
     filmsModel.setFilms(films);
     filmsController.render();
     render(siteHeader, new ProfileRatingComponent(films), RenderPosition.BEFOREEND);
     render(siteFooter, new FooterStatisticsComponent(films), RenderPosition.BEFOREEND);
   });
