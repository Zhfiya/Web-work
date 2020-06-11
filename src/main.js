import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

import './common.less';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.prototype.$axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'platform';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
