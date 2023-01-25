import AbstractView from '../framework/view/abstract-view.js';

const createPopupCommentsListTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class popupCommentsListView extends AbstractView {

  get template() {
    return createPopupCommentsListTemplate();
  }

}
