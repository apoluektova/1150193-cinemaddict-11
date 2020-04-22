import ProfileRatingComponent from "./components/profile-rating.js";
import NavigationComponent from "./components/navigation.js";
import PageController from "./controllers/page-controller.js";
import FilmsComponent from "./components/films.js";
import ExtraFilmsController from "./controllers/extra-films.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {render, RenderPosition} from "./utils/render.js";


const Cards = {
  TOTAL: 20,
  EXTRA: 2,
};

const films = generateFilms(Cards.TOTAL);
const filters = generateFilters();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeader, new ProfileRatingComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationComponent(filters), RenderPosition.BEFOREEND);

const filmsContainer = new FilmsComponent();
const filmsController = new PageController(filmsContainer);

render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);
filmsController.render(films);

const topRatedController = new ExtraFilmsController(filmsContainer, `Top Rated`);
const mostCommentedController = new ExtraFilmsController(filmsContainer, `Most Commented`);
const extraFilmCards = generateFilms(Cards.EXTRA);

if (films.length !== 0) {
  topRatedController.renderExtraFilms(extraFilmCards);
  mostCommentedController.renderExtraFilms(extraFilmCards);
}

const siteFooter = document.querySelector(`.footer`);
if (films.length !== 0) {
  render(siteFooter, new FooterStatisticsComponent(Cards.TOTAL), RenderPosition.BEFOREEND);
} else {
  render(siteFooter, new FooterStatisticsComponent(0), RenderPosition.BEFOREEND);
}
