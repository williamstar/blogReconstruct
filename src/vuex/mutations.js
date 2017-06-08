import { PRE_LOAD_DATA, ADD_CATEGORY } from './mutationTypes';

export default {
  [PRE_LOAD_DATA](state, { coverImg, categories }) {
    state.coverImg = coverImg;
    state.categories = categories;
  },
  [ADD_CATEGORY](state, data) {
    state.categories.push(data);
  },
};
