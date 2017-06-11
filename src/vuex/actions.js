import { preloadService } from '../api/index';
import { PRE_LOAD_DATA, ADD_CATEGORY, SWITCH_FAST_RENDER } from './mutationTypes';

const OK = 'success';

export default {
  preloadData({ commit }) {
    preloadService()
      .then(({ status, data }) => {
        if (status === OK) {
          commit(PRE_LOAD_DATA, data);
        }
      });
  },
  addCategory({ commit }, data) {
    commit(ADD_CATEGORY, data);
  },
  switchFastRender({ commit }) {
    commit(SWITCH_FAST_RENDER);
  },
};

