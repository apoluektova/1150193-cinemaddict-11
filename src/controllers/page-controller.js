import FilmsListComponent from "../components/films-list.js";
import SortingComponent, {SortType} from "../components/sorting.js";
import FilmCardComponent from "../components/film-card.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import FilmDetailsComponent from "../components/film-details.js";
import NoFilmsComponent from "../components/no-films.js";
import {render, openPopup, closePopup, remove, RenderPosition} from "../utils/render.js";
import {getDateFromString} from "../utils/common.js";

const Cards = {
  SHOWN: 5,
  BY_BUTTON: 5,
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

const renderFilmCards = (filmsListElement, films) => {
  films.forEach((film) => {
    renderFilmCard(filmsListElement, film);
  });
};

const getSortedFilmCards = (films, sortType, from, to) => {
  let sortedFilms = [];
  const shownFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = shownFilms.sort((a, b) => getDateFromString(b.releaseDate) - getDateFromString(a.releaseDate));
      break;
    case SortType.RATING:
      sortedFilms = shownFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = shownFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._filmsListComponent = new FilmsListComponent();
    this._sortComponent = new SortingComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noFilmsComponent = new NoFilmsComponent();
  }

  render(films) {
    const renderShowMoreButton = () => {
      if (shownFilmsCount >= films.length) {
        return;
      }

      const filmsListElement = container.querySelector(`.films-list__container`);
      render(filmsListElement, this._showMoreButtonComponent, RenderPosition.AFTEREND);

      const onShowMoreButtonClick = () => {
        const prevFilmsCount = shownFilmsCount;
        shownFilmsCount = shownFilmsCount + Cards.BY_BUTTON;

        const sortedFilmCards = getSortedFilmCards(films, this._sortComponent.getSortType(), prevFilmsCount, shownFilmsCount);
        renderFilmCards(filmsListElement, sortedFilmCards);

        if (shownFilmsCount >= films.length) {
          remove(this._showMoreButtonComponent);
        }
      };

      this._showMoreButtonComponent.setClickHandler(() => {
        onShowMoreButtonClick();
      });
    };

    const container = this._container.getElement();

    if (films.length === 0) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._filmsListComponent, RenderPosition.BEFOREEND);

    const filmsListElement = container.querySelector(`.films-list__container`);

    let shownFilmsCount = Cards.SHOWN;
    renderFilmCards(filmsListElement, films.slice(0, shownFilmsCount));
    renderShowMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      shownFilmsCount = Cards.BY_BUTTON;

      const sortedFilmCards = getSortedFilmCards(films, sortType, 0, shownFilmsCount);

      filmsListElement.innerHTML = ``;

      renderFilmCards(filmsListElement, sortedFilmCards);
      renderShowMoreButton();
    });
  }
}
