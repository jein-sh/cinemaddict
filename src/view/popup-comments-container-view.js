import AbstractView from '../framework/view/abstract-view.js';

const createPopupCommentsContainerTemplate = () => '<div class="film-details__bottom-container"></div>';

export default class popupCommentsContainerView extends AbstractView {

  get template() {
    return createPopupCommentsContainerTemplate();
  }

}
