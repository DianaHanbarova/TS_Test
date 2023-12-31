import { ApiServices } from './ApiServices';
import { CustomPagination } from './ApiPagination';

import { refs } from './refs';
import { getRenderCategories, getRenderExercises } from './functions';
import { API_TYPES } from './constants';
import { openModal } from './modal';

const pagination = new CustomPagination();
const apiCategories = new ApiServices(API_TYPES.FILTERS);
const apiExercises = new ApiServices(API_TYPES.EXEECISES);

refs.categoriesList.addEventListener('click', onCategoriesListClick);

async function onCategoriesListClick(e) {
  if (e.target.nodeName !== 'LI') {
    return;
  }
  refs.exercise.textContent = '';
  refs.exerciseDecor.classList.add('visually-hidden');
  refs.categoryError.classList.add('visually-hidden');

  const currentActiveItem = e.currentTarget.querySelector('.current');
  if (currentActiveItem) {
    currentActiveItem.classList.remove('current');
  }
  e.target.classList.add('current');
  const categorie = e.target.textContent;
  apiCategories.setCategory(categorie);
  apiExercises.setCategory(categorie);

  await renderCategories();
}

async function renderCategories() {
  const categories = await apiCategories.getCategories();
  getRenderCategories(categories.results, refs.categoriesContainer);

  console.log('categories.totalPages <= 1', categories.totalPages <= 1);

  if (!categories?.totalPages) {
    refs.categoryError.classList.remove('visually-hidden');
  }
  if (categories.totalPages <= 1) {
    console.log('categories.totalPages <= 1', categories.totalPages <= 1);
    refs.paginationBox.classList.add('visually-hidden');
    return;
  }
  refs.paginationBox.classList.remove('visually-hidden');

  pagination.init(apiCategories, categories.totalPages, categories.perPage);
}
renderCategories();

refs.categoriesContainer.addEventListener('click', onCategoriesContainerClick);

async function onCategoriesContainerClick(e) {
  console.log(e.target);
  if (e.target.closest('.js-exercise')) {
    const exercise = e.target.closest('.js-exercise').dataset.exercise;
    refs.exercise.textContent = exercise;
    refs.exerciseDecor.classList.remove('visually-hidden');

    await renderExercises(exercise);
    return;
  }
}

async function renderExercises(exercise) {
  apiExercises.setExercise(exercise);

  const exercises = await apiExercises.getExercises();
  console.log(exercises);
  getRenderExercises(exercises.results, refs.categoriesContainer);

  if (!exercises?.totalPages) {
    refs.categoryError.classList.remove('visually-hidden');
  }
  if (exercises.totalPages <= 1) {
    refs.paginationBox.classList.add('visually-hidden');
    return;
  }
  refs.paginationBox.classList.remove('visually-hidden');

  pagination.init(apiExercises, exercises.totalPages, exercises.perPage);
}
