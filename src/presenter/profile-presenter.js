import {render, replace, remove} from '../framework/render.js';
import ProfileView from '../view/profile-view.js';
import {filter} from '../untils.js';
import {FilterType} from '../const.js';

export default class FilterPresenter {
  #container = null;
  #filmsModel = null;

  #profileComponent = null;

  constructor(container, filmsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get watchedFilms() {
   return  filter[FilterType.HISTORY](this.#filmsModel.films)
  }

  init = () => {

    const prevProfileComponent = this.#profileComponent;

    this.#profileComponent = new ProfileView(this.watchedFilms);

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#container);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
