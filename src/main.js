import {createProfileRatingTemplate} from "./components/profile-rating.js";
import {createNavigationTemplate} from "./components/navigation.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createFilmsTemplate} from "./components/films.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createShowMoreButtonTemplate} from "./components/show-more-button.js";
import {createExtraFilmsTemplate} from "./components/extra-films.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";
import {createFooterStatisticsTemplate} from "./components/footer-statistics.js";
import {generateFilms} from "./mock/film.js";


const FILM_CARDS_AMOUNT = 5;
const EXTRA_FILM_CONTAINERS_AMOUNT = 2;
const EXTRA_FILM_CARDS_AMOUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const films = generateFilms(FILM_CARDS_AMOUNT);

const siteHeader = document.querySelector(`.header`);
render(siteHeader, createProfileRatingTemplate());

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createNavigationTemplate());
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsTemplate());

const filmsContainer = siteMainElement.querySelector(`.films`);
const filmsList = filmsContainer.querySelector(`.films-list`);
const filmsListContainer = filmsContainer.querySelector(`.films-list__container`);

const renderFilmCards = (cardsAmount, container) => {
  for (let i = 0; i < cardsAmount; i++) {
    render(container, createFilmCardTemplate(films[i]));
  }
};

renderFilmCards(FILM_CARDS_AMOUNT, filmsListContainer);

render(filmsList, createShowMoreButtonTemplate());

const renderExtraFilmContainers = (containersAmount) => {
  for (let i = 0; i < containersAmount; i++) {
    render(filmsContainer, createExtraFilmsTemplate());
  }
};

renderExtraFilmContainers(EXTRA_FILM_CONTAINERS_AMOUNT);

const extraFilmsContainer = filmsContainer.querySelectorAll(`.films-list--extra`);

extraFilmsContainer.forEach((element) => {
  const extraFilmsWrapper = element.querySelector(`.films-list__container`);
  renderFilmCards(EXTRA_FILM_CARDS_AMOUNT, extraFilmsWrapper);
});

const siteFooter = document.querySelector(`.footer`);
render(siteFooter, createFooterStatisticsTemplate());
render(siteFooter, createFilmDetailsTemplate(films[0]), `afterend`);
