import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import {FilterType} from './const';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const humanizeDate = (date) => dayjs(date).format('D MMMM YYYY');

const yearDate = (date) => dayjs(date).format('YYYY');

const humanizeCommentDate = (date) => dayjs().to(date);

const timeInHours = (time) => dayjs.duration(time, 'm').format('H[h] mm[m]');

const sortFilmDate = (filmA, filmB) => {

  const {filmInfo: {release: {date: dateFilmA}}} = filmA;
  const {filmInfo: {release: {date: dateFilmB}}} = filmB;

  return dayjs(dateFilmB).diff(dayjs(dateFilmA));
};

const sortFilmRating = (filmA, filmB) => {
  const {filmInfo: {totalRating: ratingFilmA}} = filmA;
  const {filmInfo: {totalRating: ratingFilmB}} = filmB;

  return ratingFilmB - ratingFilmA;
};

const sortFilmComments = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
};

export {humanizeDate, humanizeCommentDate, yearDate, timeInHours, sortFilmDate, sortFilmRating, sortFilmComments, filter};
