import {remove, render} from '../framework/render.js';
import PopupCommentsContainerView from '../view/popup-comments-container-view.js';
import PopupCommentsView from '../view/popup-comments-view.js';
import PopupCommentsTitleView from '../view/popup-comments-title-view.js';
import PopupCommentsListView from '../view/popup-comments-list-view.js';
import CommentPresenter from '../presenter/comment-presenter.js';
import NewCommentPresenter from './new-comment-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import {UserAction, UpdateType} from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class CommentsPresenter {
  #container = null;
  #commentsModel = null;
  #film = null;

  #commentPresenter = new Map();
  #newCommentPresenter = null;
  #popupCommentsTitleComponent = null;

  #popupCommentsComponent = new PopupCommentsView();
  #popupCommentsContainerComponent = new PopupCommentsContainerView();
  #popupCommentsListComponent = new PopupCommentsListView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(container, commentsModel, film) {
    this.#container = container;
    this.#commentsModel = commentsModel;
    this.#film = film;

    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#renderPopupCommentsContainer();
    this.#renderPopupComments();
    this.#renderComments();
    this.#renderPopupNewComment();
  };

  #renderPopupCommentsContainer = () => {
    render(this.#popupCommentsContainerComponent, this.#container);
  };

  #renderPopupComments = () => {
    render(this.#popupCommentsComponent, this.#popupCommentsContainerComponent.element);
  };

  #renderPopupCommentsList = () => {
    render(this.#popupCommentsListComponent, this.#popupCommentsComponent.element);
  };

  #renderPopupCommentsTitle = () => {
    this.#popupCommentsTitleComponent = new PopupCommentsTitleView(this.comments);
    render(this.#popupCommentsTitleComponent, this.#popupCommentsComponent.element);
  };

  #renderComment = (comment) => {
    const commentPresenter = new CommentPresenter(this.#popupCommentsListComponent.element, this.#handleViewAction);
    commentPresenter.init(comment);
    this.#commentPresenter.set(comment.id, commentPresenter);
  };

  #renderComments = () => {
    this.#renderPopupCommentsTitle();
    this.#renderPopupCommentsList();
    this.comments.forEach((comment) => this.#renderComment(comment));
  };

  #clearComments = () => {
    remove(this.#popupCommentsTitleComponent);
    remove(this.#popupCommentsListComponent);
    this.#commentPresenter.forEach((presenter) => presenter.destroy());
    this.#commentPresenter.clear();
    this.#newCommentPresenter.destroy();
  };

  #renderPopupNewComment = () => {
    this.#newCommentPresenter = new NewCommentPresenter(this.#popupCommentsComponent.element, this.#handleViewAction);
    this.#newCommentPresenter.init();
  };

  #renderPopupCommentsContent = () => {
    this.#renderPopupCommentsContainer();
    this.#renderPopupComments();
    this.#renderComments();
    this.#renderPopupNewComment();
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.#clearComments();
        this.#renderPopupCommentsContent();
        break;
      case UpdateType.INIT:
        this.#clearComments();
        this.#renderPopupCommentsContent();
        break;
    }
  }

  #handleViewAction = async (actionType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#newCommentPresenter.setSaving();
        try {
          await this.#commentsModel.addComment(UpdateType.MAJOR, update, this.#film);
        } catch(err) {
          this.#newCommentPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentPresenter.get(update.id).setDeleting();
        try {
          await this.#commentsModel.deleteComment(UpdateType.MAJOR, update);
        } catch(err) {
          this.#commentPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };
}
