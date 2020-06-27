<template>
  <div id="login" class="background flex flex-row jy-center">
    <div class="flex-col jy-center login_box">
      <h1>Login</h1>
      <div class="flex-row jy-center">
        <input
          type="text"
          placeholder="请输入用户名..."
          v-model="name"
          class="input-underline"
        />
      </div>
      <div class="flex-row jy-center">
        <input
          type="password"
          placeholder="请输入密码..."
          v-model="pwd"
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
    return {
      name: '',
      pwd: '',
    };
  },
  created () {
    window.addEventListener('keydown', this.handleKeyDown, true);
  },
  methods: {
    Register () {
      window.location.href = '/register';
    },
    FindPwd () {
      window.location.href = '/findPwd';
    },
    async Login () {
      // this.$store.dispatch('set_login', true);
      // window.location.href = '/index';
      try {
        const res = await this.$axios.post('/login', {
          name: this.name,
          password: this.pwd,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '登录成功！'
          });
          this.$store.dispatch('set_uid', info.data);
          this.$store.dispatch('set_name', this.name);
          this.$store.dispatch('set_login', true);
          window.location.href = '/forum';
        } else {
          this.$message({
            type: 'error',
            message: info.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleKeyDown (e) {
      let key = null;
      if (window.event === undefined) {
        key = e.keyCode;
      } else {
        key = window.event.keyCode;
      }
      if (key === 13) {
        this.Login();
      }
    },
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
