import AbstractComponent from "./abstract-component.js";
import {userRank} from "../const.js";

export const getUserRank = (films) => {
  const watchedFilms = films.filter((film) => film.alreadyWatched).length;
  let rank = ``;

  if (watchedFilms === 0) {
    rank = ``;
  } else if (watchedFilms >= userRank.novice.minFilmsAmount && watchedFilms <= userRank.novice.maxFilmsAmount) {
    rank = `Novice`;
  } else if (watchedFilms >= userRank.fan.minFilmsAmount && watchedFilms <= userRank.fan.maxFilmsAmount) {
    rank = `Fan`;
  } else if (watchedFilms >= userRank.movieBuff.minFilmsAmount) {
    rank = `Movie Buff`;
  }
  return rank;
};

export default class ProfileRating extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    const currentUserRank = getUserRank(this._films);
    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${currentUserRank}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }
}
