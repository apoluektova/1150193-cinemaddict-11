import {FilterType} from "../const.js";

export const getWatchlistFilms = (films) => {
  return films.filter((film) => !film.watchlist);
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => !film.alreadyWatched);
};

export const getFavoriteFilms = (films) => {
  return films.filter((film) => !film.isFavorite);
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
