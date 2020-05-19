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
    this.releaseDate = filmInfo.release.date;
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

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.alternativeTitle,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageRating,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "release": {
          "date": this.releaseDate,
          "release_country": this.releaseCountry
        },
        "runtime": this.duration,
        "genre": this.genre,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.watchlist,
        "already_watched": this.alreadyWatched,
        "watching_date": this.watchingDate,
        "favorite": this.isFavorite
      }
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
