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
import {generateFilters} from "./mock/filters.js";


const TOTAL_FILMS_AMOUNT = 20;
const SHOWN_FILM_CARDS_AMOUNT = 5;
const FILM_CARDS_AMOUNT_BY_BUTTON = 5;

const EXTRA_FILM_CONTAINERS_AMOUNT = 2;
const EXTRA_FILM_CARDS_AMOUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const films = generateFilms(TOTAL_FILMS_AMOUNT);
const filters = generateFilters();

const siteHeader = document.querySelector(`.header`);
render(siteHeader, createProfileRatingTemplate());

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createNavigationTemplate(filters));
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

let shownFilmCardsAmount = SHOWN_FILM_CARDS_AMOUNT;

renderFilmCards(shownFilmCardsAmount, filmsListContainer);

render(filmsList, createShowMoreButtonTemplate());

const showMoreButton = filmsList.querySelector(`.films-list__show-more`);

const onShowMoreButtonClick = () => {
  const prevFilmsCount = shownFilmCardsAmount;
  shownFilmCardsAmount = shownFilmCardsAmount + FILM_CARDS_AMOUNT_BY_BUTTON;

  films.slice(prevFilmsCount, shownFilmCardsAmount)
  .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film)));

  if (shownFilmCardsAmount >= films.length) {
    showMoreButton.remove();
  }
};

showMoreButton.addEventListener(`click`, onShowMoreButtonClick);

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
render(siteFooter, createFooterStatisticsTemplate(TOTAL_FILMS_AMOUNT));
render(siteFooter, createFilmDetailsTemplate(films[0]), `afterend`);

const popup = document.querySelector(`.film-details`);
const popupCloseButton = popup.querySelector(`.film-details__close-btn`);

const onPopupCloseButtonClick = () => {
  popup.remove();
};

popupCloseButton.addEventListener(`click`, onPopupCloseButtonClick);
