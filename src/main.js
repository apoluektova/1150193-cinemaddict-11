import ProfileRatingComponent from "./components/profile-rating.js";
import FilterController from "./controllers/filter.js";
import PageController from "./controllers/page-controller.js";
import FilmsComponent from "./components/films.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import FilmsModel from "./models/films.js";
import StatisticsComponent from "./components/statistics.js";
import {generateFilms} from "./mock/film.js";
import {render, RenderPosition, remove} from "./utils/render.js";


const Cards = {
  TOTAL: 20,
  EXTRA: 2,
};

const films = generateFilms(Cards.TOTAL);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeader, new ProfileRatingComponent(films), RenderPosition.BEFOREEND);
const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();

const filmsContainer = new FilmsComponent();
const filmsController = new PageController(filmsContainer, filmsModel);

render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);
filmsController.render(films);

const statisticsComponent = new StatisticsComponent(films);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

filterController.setOnStatsClick(() => {
  filmsController.hide();
  statisticsComponent.show(filmsModel.getFilmsAll());
});

// const topRatedController = new ExtraFilmsController(filmsContainer, `Top Rated`);
// const mostCommentedController = new ExtraFilmsController(filmsContainer, `Most Commented`);
// const extraFilmCards = generateFilms(Cards.EXTRA);

// if (films.length !== 0) {
//   topRatedController.renderExtraFilms(extraFilmCards);
//   mostCommentedController.renderExtraFilms(extraFilmCards);
// }

const siteFooter = document.querySelector(`.footer`);
if (films.length !== 0) {
  render(siteFooter, new FooterStatisticsComponent(Cards.TOTAL), RenderPosition.BEFOREEND);
} else {
  render(siteFooter, new FooterStatisticsComponent(0), RenderPosition.BEFOREEND);
}
