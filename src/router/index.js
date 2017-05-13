import Vue from 'vue';
import Router from 'vue-router';
import Editor from '@/components/editor/Editor';
import Login from '@/components/login/Login';
import Admin from '@/components/admin/Admin';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/edit/:blogId?',
      component: Editor,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/admin',
      component: Admin,
    },
  ],
});
