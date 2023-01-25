const ProfileRating = {
  START: '',
  NOVICE: 'novice',
  FUN: 'fun',
  BUFF: 'movie buff'
}

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const UserAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export {ProfileRating, SortType, FilterType, EMOTIONS, UserAction, UpdateType};
