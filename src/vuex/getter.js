export default {
  filterCategories(state) {
    return [{
      id: -1,
      val: '全部',
    }, ...state.categories];
  },
};
