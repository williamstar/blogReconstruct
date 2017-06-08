import Vue from 'vue';
import Router from 'vue-router';
import Editor from '@/components/editor/Editor';
import Login from '@/components/login/Login';
import Register from '@/components/register/Register';
import Panel from '@/components/index/Panel';
import Blog from '@/components/blog/Blog';
import Index from '@/components/index/Index';
import Personal from '@/components/personal/Personal';
import Project from '@/components/project/Project';
import Config from '@/components/config/Config';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/index',
      alias: '/',
      component: Index,
      children: [
        {
          path: '',
          component: Panel,
        },
        {
          path: 'personal',
          component: Personal,
        },
        {
          path: 'project',
          component: Project,
        },
      ],
    },
    {
      path: '/william/register',
      component: Register,
    },
    {
      path: '/blog/:blogId?',
      component: Blog,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/admin',
      component: Panel,
    },
    {
      path: '/config',
      component: Config,
    },
    {
      path: '/edit/:blogId?',
      component: Editor,
    },
  ],
});
