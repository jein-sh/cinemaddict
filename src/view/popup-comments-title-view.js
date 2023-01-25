import AbstractView from '../framework/view/abstract-view.js';

const createPopupCommentsTitleTemplate = (comments) => `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>`;

export default class PopupCommentsTitleView extends AbstractView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createPopupCommentsTitleTemplate(this.#comments);
  }

}
