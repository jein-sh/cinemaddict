import ProfilePresenter from './presenter/profile-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsPresenter from './presenter/films-presenter.js';
import StatisticPresenter from './presenter/statistic-presenter.js';

import FilterModel from './model/filter-model.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';

import FilmsApiService from './services/films-api-service.js';
import CommentsApiService from './services/comments-api-service.js';

const AUTHORIZATION = 'Basic bhvfnejucidko45785';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));

const profilePresenter = new ProfilePresenter(siteHeaderElement, filmsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

const statisticPresenter = new StatisticPresenter(siteFooterElement, filmsModel);

profilePresenter.init();
filterPresenter.init();
filmsPresenter.init();
filmsModel.init();
statisticPresenter.init();
