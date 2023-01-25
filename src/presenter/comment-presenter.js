import {render, replace, remove} from '../framework/render.js';
import PopupCommentView from '../view/popup-comment-view.js';
import {UserAction} from '../const.js';

export default class CommentPresenter {
  #container = null;
  #commentComponent = null;
  #comment = null;
  #changeData = null;

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init = (comment) => {
    this.#comment = comment;

    const prevCommentComponent = this.#commentComponent;

    this.#commentComponent = new PopupCommentView(this.#comment);

    this.#commentComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevCommentComponent === null) {
      render(this.#commentComponent, this.#container);
      return;
    }

    if (this.#container.contains(prevCommentComponent.element)) {
      replace(this.#commentComponent, prevCommentComponent);
    }

    remove(prevCommentComponent);
  };

  destroy = () => {
    remove(this.#commentComponent);
  };

  setDeleting = () => {
    this.#commentComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  };

  setAborting = () => {
    this.#commentComponent.updateElement({
      isDisabled: false,
      isDeleting: false,
    });

    this.#commentComponent.shake(reset);
  };

  #handleDeleteClick = (comment) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      comment,
    );
  };

}
