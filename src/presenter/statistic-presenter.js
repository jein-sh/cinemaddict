import {render, remove, replace} from '../framework/render.js';
import StatisticView from '../view/statistic-view.js';

export default class StatisticPresenter {
  #container = null;
  #filmsModel = null;
  #statisticComponent = null;

  constructor(container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevStatisticComponent = this.#statisticComponent;

    this.#statisticComponent = new StatisticView(this.#filmsModel.films);

    if (prevStatisticComponent === null) {
      render(this.#statisticComponent, this.#container);
      return;
    }

    replace(this.#statisticComponent, prevStatisticComponent);
    remove(prevStatisticComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

}
