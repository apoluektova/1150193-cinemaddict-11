import {formatDate} from "../utils/common.js";

export default class Film {
  constructor(data) {
    const filmInfo = data.film_info;
    const userDetails = data.user_details;

    this.id = data.id;
    this.title = filmInfo.title;
    this.alternativeTitle = filmInfo.alternative_title;
    this.rating = filmInfo.total_rating;
    this.poster = filmInfo.poster;
    this.ageRating = filmInfo.age_rating;
    this.director = filmInfo.director;
    this.writers = filmInfo.writers;
    this.actors = filmInfo.actors;
    this.releaseDate = formatDate(filmInfo.release.date);
    this.releaseCountry = filmInfo.release.release_country;
    this.duration = filmInfo.runtime;
    this.genre = filmInfo.genre;
    this.description = filmInfo.description;
    this.comments = data.comments;
    this.watchlist = userDetails.watchlist;
    this.alreadyWatched = userDetails.already_watched;
    this.isFavorite = userDetails.favorite;
    this.watchingDate = userDetails.watching_date;
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }
}
