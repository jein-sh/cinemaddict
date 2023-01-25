import {render, remove} from '../framework/render.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import TopRatedView from '../view/top-rated-view.js';

import FilmPresenter from './film-presenter.js';

import {sortFilmRating} from '../untils.js';
import {UpdateType, UserAction} from '../const.js';

const FILM_EXTRA_COUNT = 2;

export default class TopRatedPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmPresenter = new Map();

  #filmListContainerComponent = new FilmListContainerView();

  #topRatedComponent = new TopRatedView();

  constructor (container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    return this.#filmsModel.films.sort(sortFilmRating);
  }

  init = () => {
    this.#renderTopRated();
  };

  #renderTopRatedList = () => {
    render(this.#topRatedComponent, this.#container);
  }

  #renderFilmListContainer = () => {
    render(this.#filmListContainerComponent, this.#topRatedComponent.element);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListContainerComponent.element, this.#commentsModel, this.#handleViewAction);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderTopRated = () => {
    if (this.films.some((film) => film.filmInfo.totalRating !== 0)) {
      this.#renderTopRatedList();
      this.#renderFilmListContainer();
      this.#renderFilms(this.films.slice(0, FILM_EXTRA_COUNT));
    }
  };

  destroy = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#topRatedComponent);
    remove(this.#filmListContainerComponent);
  };

  #handleViewAction = (actionType, updateType, update) => {
    if (actionType === UserAction.UPDATE_FILM) {
      this.#filmsModel.updateFilm(updateType, update);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.INIT:
        this.destroy();
        this.#renderTopRated();
        break;
    }
  };
}
