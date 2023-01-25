import {render, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import FilmsWrapperView from '../view/films-wrapper-view.js';
import FilmListView from '../view/film-list-view.js';
import EmptyFilmListView from '../view/empty-film-list-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import TopRatedPresenter from './top-rated-presenter.js';
import MostCommentedPresenter from './most-commented-presenter.js';
import {sortFilmDate, sortFilmRating, filter} from '../untils.js';
import {SortType,  UpdateType, UserAction, FilterType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #container = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;
  #emptyFilmListComponent = null;

  #filmPresenter = new Map();
  #topRatedPresenter = null;
  #mostCommentedPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filterType = FilterType.ALL;
  #isLoading = true;

  #loadingComponent = new LoadingView();
  #filmsWrapperComponent = new FilmsWrapperView();
  #filmListComponent = new FilmListView();
  #filmListContainerComponent = new FilmListContainerView();

  constructor (container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmRating);
    }

    return filteredFilms;
  }

  init = () => {
    // this.#topRatedPresenter = new TopRatedPresenter(this.#filmsWrapperComponent.element, this.#filmsModel, this.#commentsModel, this.#handleViewAction);
    // this.#mostCommentedPresenter = new MostCommentedPresenter(this.#filmsWrapperComponent.element, this.#filmsModel, this.#commentsModel, this.#handleViewAction);

    this.#renderFilmsContent();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container);
  };

  #renderEmptyFilmList = () => {
    this.#emptyFilmListComponent = new EmptyFilmListView(this.#filterType);
    render(this.#emptyFilmListComponent, this.#container);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsContent({resetRenderedFilmCount: true});
    this.#renderFilmsContent();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#container);
  };

  #renderFilmsWrapper = () => {
    render(this.#filmsWrapperComponent, this.#container);
  };

  #renderFilmList = () => {
    render(this.#filmListComponent, this.#filmsWrapperComponent.element);
  };

  #renderFilmListContainer = () => {
    render(this.#filmListContainerComponent, this.#filmListComponent.element);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    render(this.#showMoreButtonComponent, this.#filmListComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
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
    this.#topRatedPresenter.init();
  }

  #renderMostCommented = () => {
    this.#mostCommentedPresenter.init();
  }

  #renderFilmsContent = () => {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderEmptyFilmList();

    } else {
      this.#renderSort();
      this.#renderFilmsWrapper();
      this.#renderFilmList();
      this.#renderFilmListContainer();
      this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

      if (filmCount > this.#renderedFilmCount) {
        this.#renderShowMoreButton();
      }
    }

    // this.#renderTopRated();
    // this.#renderMostCommented();
  };

  #clearFilmsContent = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#loadingComponent);

    if (this.#emptyFilmListComponent) {
      remove(this.#emptyFilmListComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    // this.#topRatedPresenter.destroy();
    // this.#mostCommentedPresenter.destroy();
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
      case UpdateType.MINOR:
        this.#clearFilmsContent();
        this.#renderFilmsContent();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsContent({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsContent();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearFilmsContent();
        this.#renderFilmsContent();
        break;
    }
  };

  #onShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
