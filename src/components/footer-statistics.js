import AbstractComponent from "./abstract-component.js";

const createFooterStatisticsTemplate = (films) => {
  return (
    `<section class="footer__statistics">
      <p>${films.length} movies inside</p>
    </section>`
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
