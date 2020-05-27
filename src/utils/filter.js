import {FilterType} from "../const.js";

const getWatchlistFilms = (films) => {
  return films.filter((film) => film.watchlist);
};

const getWatchedFilms = (films) => {
  return films.filter((film) => film.alreadyWatched);
};

const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getFilmsByFilter = (films, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return Array.from(films);
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getWatchedFilms(films);
    case FilterType.FAVORITES:
      return getFavoriteFilms(films);
  }

  return films;
};
