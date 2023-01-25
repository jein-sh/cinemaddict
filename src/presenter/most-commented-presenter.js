import {render, remove} from '../framework/render.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import MostCommentedView from '../view/most-commented-view.js';

import FilmPresenter from './film-presenter.js';

import {sortFilmComments} from '../untils.js';
import {UpdateType, UserAction} from '../const.js';

const FILM_EXTRA_COUNT = 2;

export default class MostCommentedPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;

  #filmPresenter = new Map();

  #filmListContainerComponent = new FilmListContainerView();

  #mostCommentedComponent = new MostCommentedView();

  constructor (container, filmsModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    return this.#filmsModel.films.sort(sortFilmComments);
  }

  init = () => {
    this.#renderMostCommented();
  };

  #renderMostCommentedList = () => {
    render(this.#mostCommentedComponent, this.#container);
  }

  #renderFilmListContainer = () => {
    render(this.#filmListContainerComponent, this.#mostCommentedComponent.element);
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListContainerComponent.element, this.#commentsModel, this.#handleViewAction);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderMostCommented = () => {
    if (this.films.some((film) => film.comments.length !== 0)) {
      this.#renderMostCommentedList();
      this.#renderFilmListContainer();
      this.#renderFilms(this.films.slice(0, FILM_EXTRA_COUNT));
    }
  };

  destroy = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#mostCommentedComponent);
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
        this.#renderMostCommented();
        break;
    }
  };
}
