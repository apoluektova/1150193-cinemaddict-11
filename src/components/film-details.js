import AbstractSmartComponent from "./abstract-smart-component.js";
import CommentsComponent from "./comments.js";
import moment from "moment";
import {formatCommentDate, getFilmDuration, formatDate} from "../utils/common.js";
import {encode} from "he";

const createFilmGenresMarkup = (genres) => {
  return genres
  .map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  })
  .join(`\n`);
};

export const createFilmDetailsTemplate = (film) => {
  const {poster, ageRating, title, alternativeTitle, rating, director, writers, actors, releaseDate, duration, genre, releaseCountry, description, comments, watchlist, alreadyWatched, isFavorite} = film;
  const filmDate = formatDate(releaseDate);
  const genresMarkup = createFilmGenresMarkup(genre);
  const filmDuration = getFilmDuration(duration);
  const ageRatingString = `${ageRating}+`;
  const watchlistButtonChecked = watchlist ? `checked` : ``;
  const alreadyWatchedButtonChecked = alreadyWatched ? `checked` : ``;
  const isFavoriteButtonChecked = isFavorite ? `checked` : ``;
  const commentsSection = new CommentsComponent(comments).getTemplate();


  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${ageRatingString}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${filmDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${filmDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__trm">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">${genresMarkup}</td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistButtonChecked}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${alreadyWatchedButtonChecked}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavoriteButtonChecked}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        ${commentsSection}
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
    .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
    .addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
  }

  setEmojiClickHandler(handler) {
    this.getElement().querySelector(`.film-details__emoji-list`)
    .addEventListener(`change`, handler);
  }

  setDeleteButtonClickHandler(handler) {
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    Array.from(deleteButtons).forEach((button) => {
      button.addEventListener(`click`, handler);
    });
  }

  setAddCommentHandler(handler) {
    const commentField = this.getElement().querySelector(`.film-details__comment-input`);
    commentField.addEventListener(`keydown`, handler);
  }

  getCommentData() {
    const emojiElement = this.getElement().querySelector(`.film-details__add-emoji-label`).firstElementChild;
    const emojiName = emojiElement.alt.substring((`emoji-`).length);

    const comment = encode(this.getElement().querySelector(`.film-details__comment-input`).value);
    const date = moment().format();
    const emotion = emojiElement ? emojiName : ``;

    return {
      // id: String(new Date() + Math.random()),
      comment,
      emotion,
      date,
    };
  }

  clearCommentData() {
    const comment = this.getElement().querySelector(`.film-details__comment-input`);
    comment.value = ``;
    const emoji = this.getElement().querySelector(`.film-details__add-emoji-label`).firstElementChild;

    if (emoji) {
      emoji.remove();
    }
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }
}

