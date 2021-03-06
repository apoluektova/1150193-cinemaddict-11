import AbstractComponent from "./abstract-component.js";
import {getFilmDuration, getShortDescription, formatDate} from "../utils/common.js";
import {MAX_DESCRIPTION_LENGTH} from "../const.js";


const createFilmCardTemplate = (film) => {
  const {title, rating, releaseDate, duration, genre, poster, description, comments, watchlist, alreadyWatched, isFavorite} = film;
  const filmDate = formatDate(releaseDate);
  const filmGenre = genre.length === 0 ? `` : genre[0];
  const filmDuration = getFilmDuration(duration);
  const filmDescription = description[0].toUpperCase() + description.substring(1);
  const shortDescription = getShortDescription(filmDescription, MAX_DESCRIPTION_LENGTH);
  const watchlistButtonActiveClass = watchlist ? `film-card__controls-item--active` : ``;
  const alreadyWatchedButtonActiveClass = alreadyWatched ? `film-card__controls-item--active` : ``;
  const isFavoriteButtonActiveClass = isFavorite ? `film-card__controls-item--active` : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${filmDate}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${filmGenre}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistButtonActiveClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${alreadyWatchedButtonActiveClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteButtonActiveClass}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setOnPosterClick(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
  }

  setOnTitleClick(handler) {
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
  }

  setOnCommentsClick(handler) {
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setOnWatchlistButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
    .addEventListener(`click`, handler);
  }

  setOnWatchedButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
    .addEventListener(`click`, handler);
  }

  setOnFavoritesButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
