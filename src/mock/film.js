import {FILM_TITLES, ALTERNATIVE_TITLES, POSTER_LINKS, DIRECTORS, WRITERS, ACTORS, RELEASE_COUNTRIES, GENRES, FILM_DESCRIPTIONS} from "../const.js";
import {getRandomIntegerNumber, getRandomDecimalNumber, getRandomArrayItem, getRandomArray, getFilmDuration} from "../utils.js";

const generateFilm = () => {
  return {
    title: getRandomArrayItem(FILM_TITLES),
    alternativeTitle: getRandomArrayItem(ALTERNATIVE_TITLES),
    rating: getRandomDecimalNumber(0, 10).toFixed(1),
    poster: getRandomArrayItem(POSTER_LINKS),
    ageRating: getRandomIntegerNumber(0, 18),
    director: getRandomArrayItem(DIRECTORS),
    writers: getRandomArray(WRITERS, getRandomIntegerNumber(0, 3)),
    actors: getRandomArray(ACTORS, getRandomIntegerNumber(1, ACTORS.length)),
    releaseDate: `01 April 1995`,
    releaseCountry: getRandomArrayItem(RELEASE_COUNTRIES),
    duration: getFilmDuration(getRandomIntegerNumber(60, 300)),
    genres: getRandomArray(GENRES, getRandomIntegerNumber(1, GENRES.length)),
    description: getRandomArray(FILM_DESCRIPTIONS, getRandomIntegerNumber(1, FILM_DESCRIPTIONS.length)),
    commentsAmount: getRandomIntegerNumber(0, 5),
  };
};

const generateFilms = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateFilm);
};

export {generateFilms};
