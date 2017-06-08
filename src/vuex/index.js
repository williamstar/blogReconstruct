import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getter';

Vue.use(Vuex);
const state = {
  coverImg: 'default-cover', // 用户封面图片
  username: '', // 用户名字
  categories: [],
};


export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
});
