import AbstractComponent from "./abstract-component.js";

const createFooterStatisticsTemplate = (films) => {
  return (
    `<p>${films.length} movies inside</p>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._films);
  }
}
