import AbstractComponent from "./abstract-component.js";

const createFooterStatisticsTemplate = (number) => {
  return (
    `<section class="footer__statistics">
      <p>${number} movies inside</p>
    </section>`
  );
};

export default class FooterStatistics extends AbstractComponent {
  constructor(number) {
    super();

    this._number = number;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._number);
  }
}
