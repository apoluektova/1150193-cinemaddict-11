import FilmCardComponent from "../components/film-card.js";
import FilmDetailsComponent from "../components/film-details.js";
import FilmsModel from './../models/film.js';
import {render, openPopup, remove, replace, RenderPosition} from "../utils/render.js";
import moment from "moment";

const SHAKE_ANIMATION_TIMEOUT = 600;
const MILLISECONDS_COUNT = 1000;

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api, filmsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._api = api;
    this._filmModel = filmsModel;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(film) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    const onFilmCardElementClick = () => {
      this._mode = Mode.DETAILS;
      openPopup(document.body, this._filmDetailsComponent);
      document.body.classList.add(`hide-overflow`);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    this._filmCardComponent.setPosterClickHandler(() => {
      this._onViewChange();
      onFilmCardElementClick();
    });

    this._filmCardComponent.setTitleClickHandler(() => {
      this._onViewChange();
      onFilmCardElementClick();
    });

    this._filmCardComponent.setCommentsClickHandler(() => {
      this._onViewChange();
      onFilmCardElementClick();
    });

    this._filmCardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmsModel.clone(film);
      newFilm.alreadyWatched = !newFilm.alreadyWatched;
      newFilm.watchingDate = newFilm.alreadyWatched ? moment().format() : null;

      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();

      const newFilm = FilmsModel.clone(film);
      newFilm.watchlist = !newFilm.watchlist;

      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();

      const newFilm = FilmsModel.clone(film);
      newFilm.isFavorite = !newFilm.isFavorite;

      this._onDataChange(this, film, newFilm);
    });

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      remove(this._filmDetailsComponent);
      this._filmDetailsComponent.clearCommentData();
      document.body.classList.remove(`hide-overflow`);
      this._mode = Mode.DETAILS;
    });

    this._filmDetailsComponent.setWatchedButtonClickHandler(() => {
      const newFilm = FilmsModel.clone(film);
      newFilm.alreadyWatched = !newFilm.alreadyWatched;
      newFilm.watchingDate = newFilm.alreadyWatched ? moment().format() : null;

      this._onDataChange(this, film, newFilm);
      this._mode = Mode.DETAILS;
    });

    this._filmDetailsComponent.setWatchlistButtonClickHandler(() => {
      const newFilm = FilmsModel.clone(film);
      newFilm.watchlist = !newFilm.watchlist;

      this._onDataChange(this, film, newFilm);
      this._mode = Mode.DETAILS;
    });

    this._filmDetailsComponent.setFavoritesButtonClickHandler(() => {
      const newFilm = FilmsModel.clone(film);
      newFilm.isFavorite = !newFilm.isFavorite;

      this._onDataChange(this, film, newFilm);
      this._mode = Mode.DETAILS;
    });

    this._filmDetailsComponent.setEmojiClickHandler((evt) => {
      const currentEmoji = evt.target.value;
      const emojiContainer = document.querySelector(`.film-details__add-emoji-label`);
      emojiContainer.innerHTML = `<img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-${currentEmoji}">`;
    });

    this._filmDetailsComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();

      const newFilm = FilmsModel.clone(film);
      const deleteButton = evt.target;
      const currentComment = deleteButton.closest(`.film-details__comment`);
      const currentCommentId = deleteButton.closest(`.film-details__comment`).id;
      const commentItems = this._filmDetailsComponent.getElement().querySelectorAll(`.film-details__comment`);
      const commentsList = Array.from(commentItems);
      const currentCommentIndex = commentsList.indexOf(currentComment);

      this._api.deleteComment(currentCommentId)
      .then(() => {
        newFilm.comments = film.comments;
        newFilm.comments.splice(currentCommentIndex, 1);

        deleteButton.innerHTML = `Deleting...`;
        deleteButton.setAttribute(`disabled`, `true`);

        this._onDataChange(this, film, newFilm);
      })
      .catch(() => {
        this._shakeComment(currentComment);
      });
    });

    this._filmDetailsComponent.setAddCommentHandler((evt) => {
      evt.target.style.border = `none`;

      const isCtrlandEnter = evt.key === `Enter` && (evt.ctrlKey || evt.metaKey);
      const newFilm = FilmsModel.clone(film);

      if (isCtrlandEnter) {
        const newComment = this._filmDetailsComponent.getCommentData();
        const form = document.querySelector(`.film-details__inner`);

        this._api.createComment(newFilm.id, newComment)
        .then(() => {
          newFilm.comments.concat(newComment);

          const formELements = form.querySelectorAll(`button, input, textarea`);
          formELements.forEach((element) => {
            element.setAttribute(`disabled`, `disabled`);
          });

          this._onDataChange(this, film, newFilm);
        })
        .catch(() => {
          this.shake();
          this._addCommentFieldBorder();
        });
      }
    });

    if (oldFilmDetailsComponent && oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._filmDetailsComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  shake() {
    this._filmDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      this._filmDetailsComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _shakeComment(currentComment) {
    currentComment.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_COUNT}s`;

    setTimeout(() => {
      currentComment.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _addCommentFieldBorder() {
    this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`).style.border = `2px solid red`;
    this._filmDetailsComponent.getElement().querySelector(`.film-details__comment-input`).removeAttribute(`disabled`);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._filmDetailsComponent);
      this._filmDetailsComponent.clearCommentData();
      document.body.classList.remove(`hide-overflow`);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
