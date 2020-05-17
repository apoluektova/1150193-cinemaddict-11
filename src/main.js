import API from "./api.js";
import FilmsComponent from "./components/films.js";
import FilmsModel from "./models/films.js";
import FilterController from "./controllers/filter.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import PageController from "./controllers/page-controller.js";
import ProfileRatingComponent from "./components/profile-rating.js";
import StatisticsComponent from "./components/statistics.js";
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic asdlkjasoktnLFAasdnoqnv`;

const Cards = {
  TOTAL: 20,
  EXTRA: 2,
};

const api = new API(AUTHORIZATION);
const filmsModel = new FilmsModel();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeader, new ProfileRatingComponent(filmsModel.getFilmsAll()), RenderPosition.BEFOREEND);
const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();

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
     filmsModel.setFilms(films);
     filmsController.render();
     render(siteFooter, new FooterStatisticsComponent(films), RenderPosition.BEFOREEND);
   });
