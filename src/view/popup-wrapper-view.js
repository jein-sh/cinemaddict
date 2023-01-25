import AbstractView from '../framework/view/abstract-view.js';

const createPopupWrapperTemplate = () => '<section class="film-details"></section>';

export default class popupWrapperView extends AbstractView {

  get template() {
    return createPopupWrapperTemplate();
  }

}
