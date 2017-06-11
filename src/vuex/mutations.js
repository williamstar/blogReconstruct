import { PRE_LOAD_DATA, ADD_CATEGORY, SWITCH_FAST_RENDER } from './mutationTypes';

export default {
  [PRE_LOAD_DATA](state, { renderWay, coverImg, categories }) {
    state.coverImg = coverImg;
    state.categories = categories;
    state.renderWay = !!renderWay;
  },
  [ADD_CATEGORY](state, data) {
    state.categories.push(data);
  },
  [SWITCH_FAST_RENDER](state) {
    state.renderWay = !state.renderWay;
  },
};
