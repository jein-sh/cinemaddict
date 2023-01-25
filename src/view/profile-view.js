import AbstractView from '../framework/view/abstract-view.js';
import { ProfileRating } from '../const.js';

const createProfileTemplate = (films) => {
  let rating = '';

  if ( films.length >=  24) {
    rating = ProfileRating.BUFF;
  } else if ( films.length < 24 && films.length > 10 ) {
    rating = ProfileRating.FUN;
  } else if ( films.length <= 10 && films.length >= 1) {
    rating = ProfileRating.NOVICE
  } else {
    rating = ProfileRating.START;
  }

  return (
  `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
  )
};

export default class ProfileView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createProfileTemplate(this.#films);
  }

}
