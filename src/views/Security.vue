<template>
    <div id="security" class="flex flex-row jy-center">
        <div class="flex flex-col center">
            <div class="flex flex-row">
                <b>密保邮箱</b>
                <b>{{ this.email }}</b>
            </div>
            <div class="flex flex-row row" v-if="!isOk">
                <input type="text" class="input-underline">
                <button class="button" @click="SendCode" v-if="!isSend">获取验证码</button>
                <button class="button" disabled v-else>{{ this.sec }}s</button>
            </div>
            <div class="flex flex-col change_box" v-if="isOk">
                <label @click="ShowItem('pwd')" :class="{active:pwdShow}">
                    <i class="el-icon-warning"></i>
                    修改密码
                </label>
                <div class="flex flex-col change_row" v-if="pwdShow">
                    <div class="flex flex-row">
                        <input type="password" v-model="newPwd" class="input-underline" placeholder="新密码...">
                        <span v-if=" newPwd && newPwd.length < 8"><i class="el-icon-warning"></i>密码少于8位！</span>
                    </div>
                    <div class="flex flex-row">
                        <input type="password" id="newPwdB" v-model="newPwdB" class="input-underline" placeholder="确认密码...">
                        <span v-if="newPwdB && newPwdB !== newPwd"><i class="el-icon-warning"></i>两次输入不一致！</span>
                    </div>
                    <div class="flex flex-row">
                        <button class="button" @click="SubmitPwd"><i class="el-icon-upload2"></i>提交</button>
                        <span class="return" @click="Return('pwd')">
                        <i class="el-icon-circle-close"></i>取消
                        </span>
                    </div>
                </div>
                <label @click="ShowItem('email')" :class="{active:emailShow}">
                    <i class="el-icon-warning"></i>
                    修改邮箱
                </label>
                <div class="flex flex-col change_row" v-if="emailShow">
                    <div class="flex flex-row">
                        <input type="text" v-model="newEmail" class="input-underline" placeholder="新邮箱...">
                        <button class="button" @click="Check" v-if="!isSend">获取验证码</button>
                        <button class="button" disabled v-else>{{ this.sec }}s</button>
                    </div>
                    <input type="text" v-model="newCode" class="input-underline" placeholder="验证码...">
                    <div class="flex flex-row">
                        <button class="button"><i class="el-icon-upload2"></i>提交</button>
                        <span class="return" @click="Return('email')">
                        <i class="el-icon-circle-close"></i>取消
                        </span>
                    </div>
                </div>
        </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'security',
  computed: {
    ...mapState(['uId']),
  },
  data () {
    return {
      email: '',
      newPwd: '',
      newPwdB: '',
      newEmail: '',
      newCode: '',
      isOk: false,

      isSend: false,
      sec: 60,
      pwdShow: false,
      emailShow: false,
    };
  },
  created () {
    this.GetInfo();
  },
  methods: {
    // 获取资料
    async GetInfo () {
      try {
        const res = await this.$axios.post('/getUserInfo', {
          u_id: this.uId,
        });
        const info = res.data;
        if (info.code === 200) {
          const infodata = info.data;
          this.email = infodata.email;
        } else {
          this.$message({
            type: 'error',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 修改密码
    async SubmitPwd () {
      try {
        const res = await this.$axios.post('/updatePassword', {
          email: this.email,
          password: this.newPwd,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.pwdShow = false;
        } else if (info.code === 409) {
          this.sessionJudge();
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
    // 修改邮箱
    async SubmitNewEmail () {
      try {
        const res = await this.$axios.post('/updateEmail', {
          u_id: this.uId,
          email: this.newEmail,
          verifyCode: this.newCode
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功！'
          });
          this.emailShow = false;
        } else if (info.code === 409) {
          this.sessionJudge();
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
    // 验证新邮箱
    async Check () {
      try {
        const res = await this.$axios.post('/sendNewMail', {
          email: this.newEmail,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '发送成功',
          });
          const timer = setInterval(() => { // 发送验证码后等待60秒的循环执行更改秒数
            this.sec = this.sec - 1;
            this.isSend = true;
            if (this.sec === 0) {
              clearInterval(timer);
              this.sec = 60;
              this.isSend = false;
            }
          }, 1000);
        } else {
          this.$message({
            type: 'error',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 验证邮箱
    async SendCode () {
      try {
        const res = await this.$axios.post('/sendMail', {
          email: this.email,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '发送成功',
          });
          const timer = setInterval(() => { // 发送验证码后等待60秒的循环执行更改秒数
            this.sec = this.sec - 1;
            this.isSend = true;
            if (this.sec === 0) {
              clearInterval(timer);
              this.sec = 60;
              this.isSend = false;
            }
          }, 1000);
        } else {
          this.$message({
            type: 'error',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 显示修改
    ShowItem (what) {
      if (what === 'pwd') {
        this.pwdShow = true;
      } else {
        this.emailShow = true;
        console.log('email');
      }
    },

    // 取消修改
    Return (option) {
      if (option === 'pwd') {
        this.pwdShow = false;
        this.newPwd = '';
        this.newPwdB = '';
      } else {
        this.emailShow = false;
        this.newEmail = '';
        this.newCode = '';
      }
    },
  },
};
</script>

<style lang="less" scoped>
#security{
    margin-top: 110px;
    .center {
        background-color: #f5f6f7;
        width: 60%;
        padding: 50px;
    }
    b {
        font-size: 20px;
        margin-right: 30px;
    }
    .row {
        margin-top: 20px;
    }
    input {
        width: 300px;
        margin-right: 10px;
    }
    button {
        background-color:darksalmon;
    }
    .change_box {
        text-align: left;
        margin-top: 50px;
        label {
            cursor: pointer;
            margin-bottom: 20px;
        }
        span {
            cursor: pointer;
        }
        .change_row {
            border: 1px dashed;
            padding: 20px;
            width: 500px;
            margin-bottom: 20px;
            input {
                margin-bottom: 10px;
            }
            button {
                height: 30px;
            }
            i {
                margin-left: 10px;
            }
            span {
                color: red;
            }
        }
    }
  .active {
    font-size: 120%;
    color: #485782;
  }
}
</style>
