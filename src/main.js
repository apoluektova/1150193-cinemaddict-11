import ProfileRatingComponent from "./components/profile-rating.js";
import NavigationComponent from "./components/navigation.js";
import SortingComponent from "./components/sorting.js";
import FilmsComponent from "./components/films.js";
import FilmsListComponent from "./components/films-list.js";
import FilmCardComponent from "./components/film-card.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import ExtraFilmsComponent from "./components/extra-films.js";
import FilmDetailsComponent from "./components/film-details.js";
import FooterStatisticsComponent from "./components/footer-statistics.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {render, RenderPosition} from "./utils.js";

const TOTAL_FILMS_AMOUNT = 20;
const SHOWN_FILM_CARDS_AMOUNT = 5;
const FILM_CARDS_AMOUNT_BY_BUTTON = 5;

const EXTRA_FILM_CARDS_AMOUNT = 2;

const renderFilmCard = (filmsListElement, film) => {
  const body = document.querySelector(`body`);

  const onFilmCardElementClick = () => {
    body.appendChild(filmDetails.getElement());
  };

  const filmCard = new FilmCardComponent(film);
  const filmPoster = filmCard.getElement().querySelector(`.film-card__poster`);
  filmPoster.addEventListener(`click`, onFilmCardElementClick);

  const filmTitle = filmCard.getElement().querySelector(`.film-card__title`);
  filmTitle.addEventListener(`click`, onFilmCardElementClick);

  const filmComments = filmCard.getElement().querySelector(`.film-card__comments`);
  filmComments.addEventListener(`click`, onFilmCardElementClick);

  const filmDetails = new FilmDetailsComponent(film);

  const filmDetailsCloseButton = filmDetails.getElement().querySelector(`.film-details__close-btn`);

  const onFilmDetailsCloseButtonClick = () => {
    body.removeChild(filmDetails.getElement());
  };

  filmDetailsCloseButton.addEventListener(`click`, onFilmDetailsCloseButtonClick);

  render(filmsListElement, filmCard.getElement(), RenderPosition.BEFOREEND);
};

const renderFilms = (filmsComponent, films) => {
  render(filmsComponent.getElement(), new FilmsListComponent().getElement(), RenderPosition.BEFOREEND);

  const filmsListElement = filmsComponent.getElement().querySelector(`.films-list__container`);

  let shownFilmCardsAmount = SHOWN_FILM_CARDS_AMOUNT;
  films.slice(0, shownFilmCardsAmount)
    .forEach((filmCard) => {
      renderFilmCard(filmsListElement, filmCard);
    });

  const showMoreButton = new ShowMoreButtonComponent();
  render(filmsComponent.getElement(), showMoreButton.getElement(), RenderPosition.BEFOREEND);

  const onShowMoreButtonClick = () => {
    const prevFilmsCount = shownFilmCardsAmount;
    shownFilmCardsAmount = shownFilmCardsAmount + FILM_CARDS_AMOUNT_BY_BUTTON;

    films.slice(prevFilmsCount, shownFilmCardsAmount)
    .forEach((filmCard) => renderFilmCard(filmsListElement, filmCard));

    if (shownFilmCardsAmount >= films.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  };

  showMoreButton.getElement().addEventListener(`click`, onShowMoreButtonClick);
};

const films = generateFilms(TOTAL_FILMS_AMOUNT);
const filters = generateFilters();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeader, new ProfileRatingComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingComponent().getElement(), RenderPosition.BEFOREEND);

const filmsContainer = new FilmsComponent();
render(siteMainElement, filmsContainer.getElement(), RenderPosition.BEFOREEND);
renderFilms(filmsContainer, films);

const renderExtraFilms = (title) => {
  const extraFilmsComponent = new ExtraFilmsComponent(title);
  render(filmsContainer.getElement(), extraFilmsComponent.getElement(), RenderPosition.BEFOREEND);
  const extraFilmsContainer = extraFilmsComponent.getElement().querySelector(`.films-list__container`);

  const extraFilmCards = generateFilms(EXTRA_FILM_CARDS_AMOUNT);
  extraFilmCards.forEach((filmCard) => {
    renderFilmCard(extraFilmsContainer, filmCard);
  });
};

renderExtraFilms(`Top Rated`);
renderExtraFilms(`Most Commented`);

const siteFooter = document.querySelector(`.footer`);
render(siteFooter, new FooterStatisticsComponent(TOTAL_FILMS_AMOUNT).getElement(), RenderPosition.BEFOREEND);
