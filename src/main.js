import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

import './common.less';
import common from './common.js';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(common);

Vue.prototype.$axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'api';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
