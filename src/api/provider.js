export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getFilms() {
    return this._api.getFilms();
  }

  updateFilm(id, film) {
    return this._api.updateFilm(id, film);
  }

  createComment(id, comment) {
    return this._api.createComment(id, comment);
  }

  deleteComment(id) {
    return this._api.deleteComment(id);
  }
}
