import AbstractView from '../framework/view/abstract-view.js';

const createPopupCommentsTemplate = () => '<section class="film-details__comments-wrap"></section>';

export default class PopupCommentsView extends AbstractView {

  get template() {
    return createPopupCommentsTemplate();
  }

}
