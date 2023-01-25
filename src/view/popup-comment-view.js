import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeCommentDate } from '../untils.js';

const createPopupCommentTemplate = (data) => {

  const {emotion, text, author, date, isDisabled, isDeleting} = data;

  const commentDate = humanizeCommentDate(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete" ${isDisabled ? 'disabled' : ''}>
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>`
  );
};

export default class PopupCommentView extends AbstractStatefulView {

  constructor(comment) {
    super();
    this._state = PopupCommentView.parseCommentToState(comment);
  }

  get template() {
    return createPopupCommentTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  reset = () => {
    this.updateElement(
      PopupCommentView.parseCommentToState(comment),
    );
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteClickHandler);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PopupCommentView.parseStateToComment(this._state));
  };

  static parseCommentToState = (comment) => {

    const state = {...comment,
      isDisabled: false,
      isDeleting: false,
    };

    return state;
  };

  static parseStateToComment = (state) => {
    const comment = {...state};

    delete comment.isDisabled;
    delete comment.isDeleting;

    return comment;
  };
}
