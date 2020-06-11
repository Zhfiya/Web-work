<template>
  <div id="menu" class="flex flex-row jy-between" v-show="isLogin">
    <div class="flex jy-start title" @click="GoTo('/index')">
      <b>F+技术论坛</b>
    </div>
    <div class="flex options">
      <span class="option" @click="GoTo('/forum')">论坛</span>
      <span class="option" @click="GoTo('/blog')">博客区</span>
      <span class="option" @click="GoTo('/personalCenter')">个人中心</span>
      <span class="option" @click="Logout">退出登录</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'menu',

  computed: {
    ...mapState(['isLogin'])
  },
  methods: {
    GoTo (val) {
      window.location.href = val;
    },
    Logout () {
      this.$store.dispatch('set_login', false);
      window.location.href = '/';
    }
  }
};
</script>

<style lang="less" scoped>
#menu {
  position: fixed;
  z-index: 1000;
  height: 60px;
  width: 100%;
  top: 0;
  left: 0;
  background-color: #f0f0f4;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
  line-height: 60px;

  .title {
    font-size: 25px;
    letter-spacing: 5px;
    margin-left: 100px;
    cursor: pointer;
  }
  .options {
    margin-right: 100px;

    .option {
      margin-left: 50px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
