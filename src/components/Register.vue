<template>
  <div id="register" class="background flex flex-col">
      <div class="title"><b>·注册·</b></div>
      <el-divider></el-divider>
      <div class="flex flex-col jy-center">
        <div class="flex flex-row row">
          <input type="text" v-model="name" placeholder="用户名..." class="input-underline">
          <span v-if="this.nameTip" :class="{green:this.nameOk}"><i class="el-icon-warning"></i>{{ nameTip }}</span>
        </div>
        <div class="flex flex-row row">
          <input type="password" v-model="pwd" placeholder="密码..." class="input-underline">
          <span v-if="this.pwdTip"><i class="el-icon-warning"></i>{{ pwdTip }}</span>
        </div>
        <div class="flex flex-row row">
          <input type="password" v-model="pwdTwo" placeholder="再次输入密码..." class="input-underline">
          <span v-if="this.pwdTwoTip"><i class="el-icon-warning"></i>{{ pwdTwoTip }}</span>
        </div>
        <div class="flex flex-row row">
          <input type="text" v-model="email" placeholder="邮箱..." class="input-underline">
          <span v-if="this.emailTip"><i class="el-icon-warning"></i>{{ emailTip }}</span>
        </div>
        <div class="flex flex-row row">
          <input type="text" v-model="code" placeholder="邮箱验证码..." class="input-underline">
          <button @click="GetCode" v-if="isOk" class="button">获取验证码</button>
          <button v-else>{{ second }}s</button>
        </div>
        <div class="flex flex-row row">
          <button class="button act" @click="Submit">注册</button>
          <button class="button back" @click="Locate('/')">返回登录</button>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      name: '',
      pwd: '',
      pwdTwo: '',
      email: '',
      code: '',

      isOk: true,
      registerOk: false,
      nameOk: false,
      nameTip: '',
      pwdTip: '',
      pwdTwoTip: '',
      emailTip: '',
      second: 60,
      showLoading: true
    };
  },

  watch: {
    name (val) {
      this.CheckName(val);
    }
  },

  methods: {
    // 检验name是否重复
    async CheckName (name) {
      if (name) {
        try {
          const res = await this.$axios.post('/checkName', {
            name: name
          });
          const info = res.data;
          if (info.code !== 200) {
            this.nameTip = '该用户名已存在！';
            this.registerOk = false;
            this.nameOk = false;
          } else {
            this.nameTip = '该用户名可以使用';
            this.nameOk = true;
            this.registerOk = true;
          }
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      }
    },

    // 获取验证码
    async GetCode () {
      if (this.Validate() && this.registerOk) {
        try {
          const res = await this.$axios.post('/sendNewMail', {
            email: this.email
          });
          const info = res.data;
          if (info.code === 200) {
            this.isOk = false;
            const timer = setInterval(() => {
              this.second = this.second - 1;
              if (this.second === 0) {
                clearInterval(timer);
                this.second = 60;
                this.isOk = true;
              }
            }, 1000);
          } else {
            this.$message({
              type: 'error',
              message: info.message
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },

    // 注册
    async Submit () {
      if (this.Validate && this.code !== null) {
        try {
          const res = await this.$axios.post('/register', {
            name: this.name,
            password: this.pwd,
            email: this.email,
            verifyCode: this.code
          });
          const info = res.data;
          if (info.code === 200) {
            this.$message({
              type: 'success',
              $message: '注册成功'
            });
            window.location.href = '/';
          }
        } catch (err) {
          console.log(err);
        }
      }
    },

    // 表单验证
    Validate () {
      let registerOk = false;
      if (!this.name) {
        this.nameTip = '用户名不能为空';
        this.nameOk = false;
        registerOk = false;
      }
      if (this.pwd.length < 7) {
        this.pwdTip = '密码长度不得少于8位';
        registerOk = false;
      } else {
        this.pwdTip = '';
      }
      if (this.pwd !== this.pwdTwo) {
        this.pwdTwoTip = '两次密码输入不一致';
        registerOk = false;
      } else {
        this.pwdTwoTip = '';
      }
      if (this.email.indexOf('@') === -1) {
        this.emailTip = '邮箱格式不正确！';
        registerOk = false;
      } else {
        this.emailTip = '';
      }
      registerOk = true;
      return registerOk;
    }
  }
};
</script>

<style lang="less" scoped>
#register{
  background: url('../assets/register.png');
  position: absolute;

    .title {
      margin-top: 100px;
      font-size: 25px;
      letter-spacing: 10px;
      color: rgb(70, 131, 91);
    }
    span {
        color:brown;
    }
    .green {
      color: green;
    }
    .row {
        height: 30px;
        margin-bottom: 50px;
        margin-left: 35%;

        input {
            width: 400px;
        }
        input:focus{
            color: lightsalmon;
            border-color: lightsalmon;
        }
        button.verify {
            margin-left: 20px;
        }
        button.act {
            margin-left: 15%;
            color: white;
            background-color: rgb(217, 171, 66);
        }
        button.back {
            margin-left: 10px;
        }
    }
}
</style>
