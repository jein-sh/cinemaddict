import AbstractView from '../framework/view/abstract-view.js';

const createFilmsContentTemplate = () => '<section class="films"></section>';

export default class FilmsContentView extends AbstractView {

  get template() {
    return createFilmsContentTemplate();
  }

}
