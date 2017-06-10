import Vue from 'vue';
import Router from 'vue-router';
/* eslint-disable */
const Editor = r => require.ensure([], () => r(require('@/components/editor/Editor')), 'admin');
const Login = r => require.ensure([], () => r(require('@/components/login/Login')), 'admin');
const Panel = r => require.ensure([], () => r(require('@/components/index/Panel')), 'normal');
const Blog = r => require.ensure([], () => r(require('@/components/blog/Blog')), 'normal');
const Index = r => require.ensure([], () => r(require('@/components/index/Index')), 'normal');
const Personal = r => require.ensure([], () => r(require('@/components/personal/Personal')), 'normal');
const Project = r => require.ensure([], () => r(require('@/components/project/Project')), 'normal');
const Config = r => require.ensure([], () => r(require('@/components/config/Config')), 'admin');
/* eslint-enable */
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
