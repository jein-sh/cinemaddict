import AbstractView from '../framework/view/abstract-view.js';

const createStatisticTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`
);

export default class StatisticView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createStatisticTemplate(this.#films);
  }
}


