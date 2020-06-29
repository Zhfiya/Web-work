<template>
  <div id="menu" class="flex flex-row jy-between" v-show="isLogin">
    <div class="flex jy-start title" @click="GoTo('/index')">
      <b>F+技术论坛</b>
    </div>
    <div class="flex options">
      <span class="option" @click="GoTo('/forum')">论坛</span>
      <span class="option" @click="GoTo('/blog')">博客区</span>
      <el-dropdown @command="handleCommand">
        <img :src="this.Url" alt="" class="avator option el-dropdown-link">
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/personalInfo"><i class="el-icon-setting"></i>个人资料</el-dropdown-item>
          <el-dropdown-item command='/buildBlog'><i class="el-icon-edit"></i>写博客</el-dropdown-item>
          <el-dropdown-item command='/personalBlog'><i class="el-icon-document-copy"></i>博客管理</el-dropdown-item>
          <el-dropdown-item command="logout"><i class="el-icon-switch-button"></i>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'menu',
  data () {
    return {
      Url: '',
    };
  },

  computed: {
    ...mapState(['isLogin']),
    ...mapState(['avator']),
  },
  created () {
    this.Url = require(`../assets/avator/${this.avator}.jpg`);
  },
  methods: {
    GoTo (val) {
      window.location.href = val;
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.Logout();
      } else {
        window.location.href = command;
      }
    },
    async Logout () {
      try {
        const res = await this.$axios.post('/logout', {});
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '退出登录',
          });
          this.$store.dispatch('set_login', false);
          window.location.href = '/';
        }
      } catch (err) {
        console.log(err);
      }
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
  .avator {
    margin-top: 10px;
    width: 40px;
    height: 40px;
  }
}
</style>
