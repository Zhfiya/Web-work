<template>
  <div id="login" class="background flex flex-row jy-center">
    <div class="flex-col jy-center login_box">
      <h1>Login</h1>
      <div class="flex-row jy-center">
        <input
          type="text"
          placeholder="请输入用户名..."
          class="input-underline"
        />
      </div>
      <div class="flex-row jy-center">
        <input
          type="password"
          placeholder="请输入密码..."
          class="input-underline"
        />
      </div>
      <div class="flex-row jy-center">
        <button class="button" @click="Login">登录</button>
      </div>
      <div class="flex flex-col row">
        <span @click="FindPwd">找回密码?</span>
        <span @click="Register">立即注册?</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {};
  },

  methods: {
    Register () {
      window.location.href = '/register';
    },
    FindPwd () {
      window.location.href = '/findPwd';
    },
    Login () {
      this.$store.dispatch('set_login', true);
      window.location.href = '/index';
    }
  }
};
</script>

<style lang="less" scoped>
#login {
  color: rgb(217, 171, 66);
  background: linear-gradient(#aac9ce, #f3dbcf);

  .login_box {
    width: 400px;
    height: 400px;
    margin-top: 150px;
    border-radius: 5px;

    h1 {
      font-size: 32px;
    }
    .row {
      float: right;
      padding: 30px 50px;
      font-size: 13px;
      span {
        width: auto;
        cursor: pointer;
        margin-top: 5px;
        color: rgb(64, 91, 85);
      }
    }
  }
  input {
    width: 400px;
    margin-top: 50px;
  }
  input:focus {
    color: lightsalmon;
    border-color: lightsalmon;
  }
  button {
    margin-top: 50px;
    padding: 5px 20px;
    background-color: rgb(168, 216, 185);
    color: white;
  }
}
</style>
