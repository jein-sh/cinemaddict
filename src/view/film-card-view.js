import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {yearDate, timeInHours} from '../untils.js';

const createFilmCardTemplate = (film) => {
  const {
    filmInfo: {
      title,
      totalRating,
      poster,
      release: {
        date,
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
    comments,
    isDisabled
  } = film;

  const releaseData = yearDate(date);

  const mainGenre = genres[0];
  const time = timeInHours(runtime);

  const text = () => {
    const str = description

    if (str.length > 140 ) {
      return (`${str.substr(0, 139)}...`);
    }
    return str
  }

  const activeClassName = (control) => control
    ? 'film-card__controls-item--active'
    : '';

  return (
    `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseData}</span>
        <span class="film-card__duration">${time}</span>
        <span class="film-card__genre">${mainGenre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${text()}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeClassName(watchlist)}" ${isDisabled ? 'disabled' : ''} type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeClassName(alreadyWatched)}" ${isDisabled ? 'disabled' : ''} type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${activeClassName(favorite)}" ${isDisabled ? 'disabled' : ''} type="button">Mark as favorite</button>
    </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractStatefulView{
  #film = null;

  constructor(film) {
    super();
    this.#film = film
    // this._state = FilmCardView.parseFilmToState(film);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  // _restoreHandlers = () => {
  //   this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
  //   this.setAddToWatchlistClickHandler(this._callback.addToWatchlistClick);
  //   this.setFavoriteClickHandler(this._callback.favoriteClick);
  //   this.setFilmCardClickHandler(this._callback.cardClick);
  // };

  // reset = () => {
  //   this.updateElement(
  //     FilmCardView.parseFilmToState(film),
  //   );
  // };

  setFilmCardClickHandler = (callback) => {
    this._callback.cardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmCardClickHandler);
  };

  setAddToWatchlistClickHandler = (callback) => {
    this._callback.addToWatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addToWatchlistClickHandler);
  };

  setMarkAsWatchedClickHandler = (callback) => {
    this._callback.markAsWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#markAsWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };

  #addToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
    console.log('click', film)
  };

  #markAsWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  // static parseFilmToState = (film) => {
  //   const state = {...film,
  //     isDisabled: false,
  //   };

  //   return state;
  // };

  // static parseStateToFilm = (state) => {
  //   const film = {...state};

  //   delete film.isDisabled;

  //   return film;
  // };
}

