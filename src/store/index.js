import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    setLogin (state, isLogin) {
      state.isLogin = isLogin;
    }
  },
  actions: {
    set_login (set, isLogin) {
      set.commit('setLogin', isLogin);
    }
  },
  modules: {}
});
