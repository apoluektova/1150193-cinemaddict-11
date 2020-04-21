import FilmsListComponent from "../components/films-list.js";
import FilmCardComponent from "../components/film-card.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import FilmDetailsComponent from "../components/film-details.js";
import NoFilmsComponent from "../components/no-films.js";
import {render, openPopup, closePopup, remove, RenderPosition} from "../utils/render.js";

const Cards = {
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
      closePopup(body, filmDetails);
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

  filmDetails.setCloseButtonClickHandler(() => {
    closePopup(body, filmDetails);
  });

  render(filmsListElement, filmCard, RenderPosition.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._filmsListComponent = new FilmsListComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
  }

  render(films) {
    const container = this._container.getElement();

    if (films.length === 0) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._filmsListComponent, RenderPosition.BEFOREEND);

    const filmsListElement = container.querySelector(`.films-list__container`);

    let shownFilmCardsAmount = Cards.SHOWN;
    films.slice(0, shownFilmCardsAmount)
      .forEach((filmCard) => {
        renderFilmCard(filmsListElement, filmCard);
      });

    render(container, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    const onShowMoreButtonClick = () => {
      const prevFilmsCount = shownFilmCardsAmount;
      shownFilmCardsAmount = shownFilmCardsAmount + Cards.BY_BUTTON;

      films.slice(prevFilmsCount, shownFilmCardsAmount)
      .forEach((filmCard) => renderFilmCard(filmsListElement, filmCard));

      if (shownFilmCardsAmount >= films.length) {
        remove(this._showMoreButtonComponent);
        this._showMoreButtonComponent.removeElement();
      }
    };

    this._showMoreButtonComponent.setClickHandler(() => {
      onShowMoreButtonClick();
    });
  }
}
