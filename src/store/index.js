import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    uId: '',
    uName: '',
    avator: 1,
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
    setAvator (state, avator) {
      state.uName = avator;
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
    set_avator (set, avator) {
      set.commit('setAvator', avator);
    },
  },
  modules: {}
});
