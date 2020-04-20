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
import NoFilmsComponent from "./components/no-films.js";
import {generateFilms} from "./mock/film.js";
import {generateFilters} from "./mock/filters.js";
import {render, openPopup, closePopup, remove, RenderPosition} from "./utils/render.js";

const Cards = {
  TOTAL: 20,
  SHOWN: 5,
  BY_BUTTON: 5,
  EXTRA: 2,
};

const renderFilmCard = (filmsListElement, film) => {
  const body = document.querySelector(`body`);

  const onFilmCardElementClick = () => {
    openPopup(body, filmDetails);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      onFilmDetailsClose();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const filmCard = new FilmCardComponent(film);

  filmCard.setPosterClickHandler(() => {
    onFilmCardElementClick();
  });

  filmCard.setTitleClickHandler(() => {
    onFilmCardElementClick();
  });

  filmCard.setCommentsClickHandler(() => {
    onFilmCardElementClick();
  });

  const filmDetails = new FilmDetailsComponent(film);

  const filmDetailsCloseButton = filmDetails.getElement().querySelector(`.film-details__close-btn`);

  // closePopup(body, filmDetails); // выполнять здесь нельзя, элемента еще нет, надо запихнуть в обработчик

  /* const onFilmDetailsClose = () => {
    body.removeChild(filmDetails.getElement());
  }; */

  // filmDetailsCloseButton.addEventListener(`click`, onFilmDetailsClose);

  render(filmsListElement, filmCard, RenderPosition.BEFOREEND);
};

const renderFilms = (filmsComponent, films) => {
  if (films.length === 0) {
    render(filmsComponent.getElement(), new NoFilmsComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(filmsComponent.getElement(), new FilmsListComponent(), RenderPosition.BEFOREEND);

  const filmsListElement = filmsComponent.getElement().querySelector(`.films-list__container`);

  let shownFilmCardsAmount = Cards.SHOWN;
  films.slice(0, shownFilmCardsAmount)
    .forEach((filmCard) => {
      renderFilmCard(filmsListElement, filmCard);
    });

  const showMoreButton = new ShowMoreButtonComponent();
  render(filmsComponent.getElement(), showMoreButton, RenderPosition.BEFOREEND);

  const onShowMoreButtonClick = () => {
    const prevFilmsCount = shownFilmCardsAmount;
    shownFilmCardsAmount = shownFilmCardsAmount + Cards.BY_BUTTON;

    films.slice(prevFilmsCount, shownFilmCardsAmount)
    .forEach((filmCard) => renderFilmCard(filmsListElement, filmCard));

    if (shownFilmCardsAmount >= films.length) {
      remove(showMoreButton);
      showMoreButton.removeElement();
    }
  };

  showMoreButton.setClickHandler(`click`, onShowMoreButtonClick);
};

const films = generateFilms(Cards.TOTAL);
const filters = generateFilters();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeader, new ProfileRatingComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationComponent(filters), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingComponent(), RenderPosition.BEFOREEND);

const filmsContainer = new FilmsComponent();
render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);
renderFilms(filmsContainer, films);

const renderExtraFilms = (title) => {
  const extraFilmsComponent = new ExtraFilmsComponent(title);
  render(filmsContainer.getElement(), extraFilmsComponent, RenderPosition.BEFOREEND);
  const extraFilmsContainer = extraFilmsComponent.getElement().querySelector(`.films-list__container`);

  const extraFilmCards = generateFilms(Cards.EXTRA);
  extraFilmCards.forEach((filmCard) => {
    renderFilmCard(extraFilmsContainer, filmCard);
  });
};

if (films.length !== 0) {
  renderExtraFilms(`Top Rated`);
  renderExtraFilms(`Most Commented`);
}


const siteFooter = document.querySelector(`.footer`);
if (films.length !== 0) {
  render(siteFooter, new FooterStatisticsComponent(Cards.TOTAL), RenderPosition.BEFOREEND);
} else {
  render(siteFooter, new FooterStatisticsComponent(0), RenderPosition.BEFOREEND);
}
