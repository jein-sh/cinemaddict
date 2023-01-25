import AbstractView from '../framework/view/abstract-view.js';

const createPopupFormTemplate = () => '<form class="film-details__inner" action="" method="get"></form>';

export default class popupFormView extends AbstractView {

  get template() {
    return createPopupFormTemplate();
  }

}
