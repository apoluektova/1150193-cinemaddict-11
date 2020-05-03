import {FILM_TITLES, ALTERNATIVE_TITLES, POSTER_LINKS, DIRECTORS, WRITERS, ACTORS, DATES, RELEASE_COUNTRIES, GENRES, FILM_DESCRIPTIONS} from "../const.js";
import {getRandomIntegerNumber, getRandomDecimalNumber, getRandomArrayItem, getRandomArray, getFilmDuration, formatDate} from "../utils/common.js";
import {generateComments} from "./comment.js";

const generateFilm = () => {
  return {
    id: String(new Date() + Math.random()),
    title: getRandomArrayItem(FILM_TITLES),
    alternativeTitle: getRandomArrayItem(ALTERNATIVE_TITLES),
    rating: getRandomDecimalNumber(0, 10).toFixed(1),
    poster: getRandomArrayItem(POSTER_LINKS),
    ageRating: getRandomIntegerNumber(0, 18),
    director: getRandomArrayItem(DIRECTORS),
    writers: getRandomArray(WRITERS, getRandomIntegerNumber(0, 3)).join(`, `),
    actors: getRandomArray(ACTORS, getRandomIntegerNumber(1, ACTORS.length)).join(`, `),
    releaseDate: formatDate(getRandomArrayItem(DATES)),
    releaseCountry: getRandomArrayItem(RELEASE_COUNTRIES),
    duration: getFilmDuration(getRandomIntegerNumber(60, 300)),
    genres: getRandomArray(GENRES, getRandomIntegerNumber(1, GENRES.length)),
    description: getRandomArray(FILM_DESCRIPTIONS, getRandomIntegerNumber(1, FILM_DESCRIPTIONS.length)).join(` `),
    comments: generateComments(getRandomIntegerNumber(0, 7)),
    watchlist: Math.random() > 0.5,
    alreadyWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateFilms = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateFilm);
};

export {generateFilms};
