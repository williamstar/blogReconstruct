import Vue from 'vue';
import Router from 'vue-router';
import editor from '@/components/editor/Editor';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/editor',
      component: editor,
    },
  ],
});
