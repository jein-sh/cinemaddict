import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view';
import PopupPresenter from './popup-presenter.js';
import {UserAction, UpdateType} from '../const.js';

const bodyElement = document.querySelector('body');

export default class FilmPresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #film = null;
  #changeData = null;
  #commentsModel = null;
  #popupPresenter = null;

  constructor(filmListContainer, commentsModel, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(this.#film);
    this.#popupPresenter = new PopupPresenter(bodyElement, this.#film, this.#commentsModel, this.#changeData);
    this.#popupPresenter.rerender();

    this.#filmComponent.setFilmCardClickHandler(this.#handleFilmCardClick);
    this.#filmComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#filmComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }

    if (this.#filmListContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  #renderPopup = () => {
    this.#popupPresenter.init(this.#film);
  };

  #handleFilmCardClick = () => {
    this.#renderPopup();
  };

  #handleAddToWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}}
    );
    this.#popupPresenter.getScrollPosition();

  };

  #handleMarkAsWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}}
    );
    this.#popupPresenter.getScrollPosition();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}}
    );
    this.#popupPresenter.getScrollPosition();
  };
}
