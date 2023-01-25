import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate, timeInHours } from '../untils.js';

const createPopupDetailsTemplate = (film) => {

  const {
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writers,
      actors,
      release: {
        date,
        releaseCountry
      },
      runtime,
      genres,
      description
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite
    },
    isDisabled
  } = film;

  const age = `${ageRating}+`;

  const releaseData = humanizeDate(date);

  const time = timeInHours(runtime);

  const activeClassName = (control) => control
    ? 'film-details__control-button--active'
    : '';

  const genresTemplate = () => {

    let genresList = '';
    genres.forEach((genre) => {

      genresList +=
        `<span class="film-details__genre">${genre}</span>`;
    });
    return genresList;
  };

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${poster} alt="">
          <p class="film-details__age">${age}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseData}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${time}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length === 1 ? `Genre` : `Genres`}</td>
              <td class="film-details__cell">${genresTemplate()}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${activeClassName(watchlist)}" ${isDisabled ? 'disabled' : ''} id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${activeClassName(alreadyWatched)}" ${isDisabled ? 'disabled' : ''} id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${activeClassName(favorite)}" ${isDisabled ? 'disabled' : ''} id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`
  );
};

export default class PopupDetailsdView extends AbstractStatefulView {

  constructor(film) {
    super();
    this._state = PopupDetailsdView.parsePopupToState(film);
  }

  get template() {
    return createPopupDetailsTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setAddToWatchlistClickHandler(this._callback.addToWatchlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  };

  setAddToWatchlistClickHandler = (callback) => {
    this._callback.addToWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchlistClickHandler);
  };

  setMarkAsWatchedClickHandler = (callback) => {
    this._callback.markAsWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#markAsWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #addToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  };

  #markAsWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  static parsePopupToState = (film) => {
    const state = {...film,
      isDisabled: false,
    };

    return state;
  };

  static parseStateToPopup = (state) => {
    const film = {...state};

    delete film.isDisabled;

    return comment;
  };

}
