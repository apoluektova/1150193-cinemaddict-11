import AbstractComponent from "./abstract-component.js";
import {userRank} from "../const.js";

const Rank = {
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`,
};

export const getUserRank = (films) => {
  const watchedFilms = films.filter((film) => film.alreadyWatched).length;
  let rank = ``;

  if (watchedFilms === 0) {
    rank = ``;
  } else if (watchedFilms >= userRank.novice.minFilmsAmount && watchedFilms <= userRank.novice.maxFilmsAmount) {
    rank = Rank.NOVICE;
  } else if (watchedFilms >= userRank.fan.minFilmsAmount && watchedFilms <= userRank.fan.maxFilmsAmount) {
    rank = Rank.FAN;
  } else if (watchedFilms >= userRank.movieBuff.minFilmsAmount) {
    rank = Rank.MOVIE_BUFF;
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
