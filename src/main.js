// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import {
  Pagination,
  Autocomplete,
  Input,
  Switch,
  Select,
  Option,
  Button,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Icon,
  Row,
  Col,
  Card,
  Dialog,
} from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(Pagination);
Vue.use(Autocomplete);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(FormItem);
Vue.use(TabPane);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Form);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
