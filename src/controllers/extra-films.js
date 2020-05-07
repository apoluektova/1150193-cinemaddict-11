import ExtraFilmsComponent from "../components/extra-films.js";
import FilmCardComponent from "../components/film-card.js";
import FilmDetailsComponent from "../components/film-details.js";
import {render, openPopup, closePopup, RenderPosition} from "../utils/render.js";

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

export default class ExtraFilmsController {
  constructor(container, title) {
    this._container = container;
    this._title = title;
    this._extraFilmsComponent = new ExtraFilmsComponent(this._title);
  }

  renderExtraFilms(extraFilms) {
    const container = this._container.getElement();
    render(container, this._extraFilmsComponent, RenderPosition.BEFOREEND);
    const extraFilmsContainer = this._extraFilmsComponent.getElement().querySelector(`.films-list__container`);

    extraFilms.forEach((filmCard) => {
      renderFilmCard(extraFilmsContainer, filmCard);
    });
  }
}
