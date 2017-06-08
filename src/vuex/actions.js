import { preloadService } from '../api/index';
import { PRE_LOAD_DATA, ADD_CATEGORY } from './mutationTypes';

const OK = 'success';

export default {
  preloadData({ commit }) {
    preloadService()
      .then(({ status, data }) => {
        if (status === OK) {
          commit(PRE_LOAD_DATA, {
            coverImg: `/image/${data.coverImg}`,
            categories: data.categories,
          });
        }
      });
  },
  addCategory({ commit }, data) {
    commit(ADD_CATEGORY, data);
  },
};

