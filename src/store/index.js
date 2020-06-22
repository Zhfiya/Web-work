import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    uId: '',
    uName: '',
  },
  mutations: {
    setLogin (state, isLogin) {
      state.isLogin = isLogin;
    },
    setUid (state, uid) {
      state.uId = uid;
    },
    setName (state, uName) {
      state.uName = uName;
    },
  },
  actions: {
    set_login (set, isLogin) {
      set.commit('setLogin', isLogin);
    },
    set_uid (set, uid) {
      set.commit('setUid', uid);
    },
    set_name (set, uName) {
      set.commit('setName', uName);
    },
  },
  modules: {}
});
