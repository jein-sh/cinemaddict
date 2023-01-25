import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class CommentsModel  extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (film) => {

    try {
      const comments = await this.#commentsApiService.getComments(film);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  };

  #adaptToClient = (comment) => {

    const adaptedComment = {...comment,
      text: comment['comment'],
    }

    delete adaptedComment['comment'];

    return adaptedComment;
  };


  addComment = async (updateType, update, film) => {
    try {
      const newComment = await this.#commentsApiService.addComment(update, film);
      this.#comments = newComment.comments.map(this.#adaptToClient);
      console.log('addcomment', this.#comments)
      this._notify(updateType, newComment);
    } catch(err) {
      console.log('addComment err', err)
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting Comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
