import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const EmptyFilmListType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
};

const createEmptyFilmListTemplate = (filterType) => {
  const emptyFilmListText = EmptyFilmListType[filterType];

  return (
    `<section class="films-list">
      <h2 class="films-list__title">${emptyFilmListText}</h2>
    </section>`
  );
};

export default class EmptyFilmListView  extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyFilmListTemplate(this.#filterType);
  }
}
