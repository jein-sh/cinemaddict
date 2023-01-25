import {render, replace, remove} from '../framework/render.js';
import PopupDetailsView from '../view/popup-details-view.js';
import PopupWrapperView from '../view/popup-wrapper-view.js';
import PopupFormView from '../view/popup-form-view.js';
import {UpdateType, UserAction} from '../const.js';

import CommentsPresenter from '../presenter/comments-presenter.js';

const bodyElement = document.querySelector('body');

export default class PopupPresenter {
  #popupDetailsComponent = null;
  #commentsPresenter = null;
  #commentsModel = null;
  #scrollPosition = null;

  #popupWrapperComponent = new PopupWrapperView();
  #popupFormComponent = new PopupFormView();


  #film = null;
  #container = null;
  #changeData = null;

  constructor(container, film, commentsModel, changeData) {
    this.#container = container;
    this.#film = film;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
  }

  init = () => {

    this.#closePopup();
    this.#commentsModel.init(this.#film);
    this.#commentsPresenter = new CommentsPresenter(this.#popupFormComponent.element, this.#commentsModel, this.#film);

    const prevPopupDetailsComponent = this.#popupDetailsComponent;
    this.#popupDetailsComponent = new PopupDetailsView(this.#film);
    this.#popupDetailsComponent.element.scrollTo(0, this.#scrollPosition)

    this.#popupDetailsComponent.setCloseButtonClickHandler(this.#handleCloseButtonClick);
    this.#popupDetailsComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#popupDetailsComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);
    this.#popupDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#renderPopupWrapper();
    this.#renderPopupForm();

    if (prevPopupDetailsComponent === null) {
      this.#renderPopupDetails();
      return;
    }

    if (prevPopupDetailsComponent.element) {
      replace(this.#popupDetailsComponent, prevPopupDetailsComponent);
    }

    remove(prevPopupDetailsComponent);
  };

  rerender = () => {
    const popup = bodyElement.querySelector('.film-details');
    if(popup) {
      this.getScrollPosition();
      this.init();
      console.log(this.#scrollPosition)
    }
  }

  #renderPopupWrapper = () => {
    render(this.#popupWrapperComponent, this.#container);
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #renderPopupForm = () => {
    render(this.#popupFormComponent, this.#popupWrapperComponent.element);
  };

  #renderPopupDetails = () => {
    render(this.#popupDetailsComponent, this.#popupFormComponent.element);
    this.#commentsPresenter.init();
  };

  getScrollPosition = () => {
    const popup = bodyElement.querySelector('.film-details');
    if (popup) {
      this.#scrollPosition = popup.scrollTop;
    }
  }

  #closePopup = () => {
    const popup = bodyElement.querySelector('.film-details');
    if(popup) {
      popup.remove();
      bodyElement.classList.remove('hide-overflow');
    }
  };

  #handleCloseButtonClick = () => {
    this.#closePopup();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleAddToWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}}
    );
    this.getScrollPosition();
  };

  #handleMarkAsWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}}
    );
    this.getScrollPosition();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}}
    );
    this.getScrollPosition();
  };
}
