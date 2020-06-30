<template>
  <div id="personalCenter" class="background">
    <div class="title">
      <b><i class="el-icon-user"></i>个人资料</b>
    </div>
    <div class="flex flex-row card">
        <div class="flex flex-col avator">
          <img :src="Url" alt="">
          <span @click="Open">修改头像</span>
          <div class="flex flex-row jy-center fans_row" @click="Locate('/relatives')">
            <span class="guan">关注<br>{{ this.guan }}</span>
            <span class="fen">粉丝<br>{{ this.fen }}</span>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex flex-row row">
            <label>用户名</label>
            <span v-if="!isEdit">{{ this.name }}</span>
            <input type="text" class="input-underline" v-model="name" v-else>
          </div>
          <div class="flex flex-row row">
            <label>性别</label>
            <span v-if="!isEdit">{{ this.sex }}</span>
            <el-select v-model="sex" placeholder="请选择" size="small" v-else>
              <el-option value="男">男</el-option>
              <el-option value="女">女</el-option>
            </el-select>
          </div>
          <div class="flex flex-row row">
            <label>生日</label>
            <span v-if="!isEdit">{{ this.birth }}</span>
            <el-date-picker
              v-model="birth"
              type="date"
              placeholder="选择日期"
              v-else
              value-format="yyyy/MM/dd"
              size="small">
            </el-date-picker>
          </div>
          <div class="flex flex-row row">
            <label>等级</label>
            <span>{{ this.level }}</span>
          </div>
          <div class="flex flex-row row">
            <label>邮箱</label>
            <span>{{ this.email }}</span>
          </div>
          <div class="flex flex-row row">
            <label>简介</label>
            <span v-if="!isEdit">{{ this.intro }}</span>
            <input type="text" v-model="intro" class="input-underline" v-else>
          </div>
        </div>
    </div>
    <div>
      <button class="button main" @click="isEdit = true" v-if="!isEdit">编辑资料</button>
      <button class="button main" @click="Submit" v-else>提交</button>
      <button class="button exit" v-if="isEdit" @click="Exit">取消编辑</button>
    </div>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="600px">
      <div class="flex flex-col win">
        <div class="flex flex-row">
          <img
          v-for="(it, index) in avs"
          :key="it.src"
          :src="it.src"
          @click="SubmitAvator(index + 1)"
          :class="{active:num === index + 1}">
        </div>
        <div class="flex flex-row">
          <img
          v-for="(it, index) in avs2"
          :key="it.src"
          :src="it.src"
          @click="SubmitAvator(index + 6)"
          :class="{active:num === index + 6}">
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="UpdateAvator">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'personalCenter',
  computed: {
    ...mapState(['uId']),
  },
  data () {
    return {
      name: 'Fine',
      birth: '2000/05/27',
      sex: '女',
      email: 'Paranoid_ZH@163.com',
      level: 5,
      intro: '啊哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
      portrait: 1,
      guan: 0,
      fen: 0,
      num: 0,
      Url: '',
      avs: [
        { src: require('../assets/avator/1.jpg') },
        { src: require('../assets/avator/2.jpg') },
        { src: require('../assets/avator/3.jpg') },
        { src: require('../assets/avator/4.jpg') },
        { src: require('../assets/avator/5.jpg') },
      ],
      avs2: [
        { src: require('../assets/avator/6.jpg') },
        { src: require('../assets/avator/7.jpg') },
        { src: require('../assets/avator/8.jpg') },
        { src: require('../assets/avator/9.jpg') },
        { src: require('../assets/avator/10.jpg') },
      ],

      isEdit: false,
      dialogVisible: false,
    };
  },

  created () {
    this.GetInfo();
    this.GetCount();
    this.num = this.portrait;
  },

  methods: {
    Open () {
      this.dialogVisible = true;
      this.num = this.portrait;
    },
    SubmitAvator (index) {
      this.num = index;
    },
    // 获取资料
    async GetInfo () {
      try {
        const res = await this.$axios.post('/getUserInfo', {
          u_id: this.uId,
        });
        const info = res.data;
        if (info.code === 200) {
          const infodata = info.data;
          this.name = infodata.name;
          this.$store.dispatch('set_name', infodata.name);
          this.email = infodata.email;
          this.birth = infodata.birth;
          this.level = infodata.level;
          this.intro = infodata.information;
          this.portrait = infodata.portrait;
          this.Url = require(`../assets/avator/${this.portrait}.jpg`);
          this.$store.dispatch('set_avator', infodata.portrait);
        } else {
          this.$message({
            type: 'success',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 编辑资料
    async Submit () {
      try {
        const res = await this.$axios.post('/updateUserInfo', {
          u_id: this.uId,
          name: this.name,
          sex: this.sex,
          information: this.intro,
          birth: this.birth,
          portrait: this.portrait,
        });
        const info = res.data;
        if (info.code === 200) {
          this.isEdit = false;
        } else {
          this.$message({
            type: 'success',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 编辑头像
    async UpdateAvator () {
      try {
        console.log(this.num);
        const res = await this.$axios.post('/updatePortrait', {
          u_id: this.uId,
          portrait: this.num,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '更换成功！',
          });
          this.Url = require(`../assets/avator/${this.num}.jpg`);
          this.$store.dispatch('set_avator', this.num);
          this.dialogVisible = false;
          this.$router.go(0);
        } else {
          this.$message({
            type: 'success',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    Exit () {
      this.isEdit = false;
    },
    async GetCount () {
      try {
        const res1 = await this.$axios.post('/countFollowers', {
          u_id: this.uId,
        });
        const res2 = await this.$axios.post('/countFans', {
          u_id: this.uId,
        });
        const info1 = res1.data;
        const info2 = res2.data;
        if (info1.code === 200) {
          const infodata = info1.data;
          this.guan = infodata.followerNum;
        } else if (info2.code === 200) {
          const infodata = info2.data;
          this.fen = infodata.fanNum;
        }
      } catch (err) {
        console.log(err);
      }
    },
  }
};
</script>

<style lang="less" scoped>
#personalCenter{
  margin-top: 60px;
  position: absolute;
  background: linear-gradient(#FFFFFF, #e9e7ef);
  .title {
    margin-top: 100px;
    font-size: 25px;
  }
  .card {
    width: 50%;
    margin-left: 25%;
    margin-top: 20px;
    text-align: left;
    border: 1px dashed;
    padding: 30px;
  }
  .row {
    margin-bottom: 20px;
    width: 100%;
    label {
      margin-left: 100px;
      display: inline-block;
      width: 100px;
      font-weight: bold;
    }
  }
  img {
    width: 100px;
    height: 100px;
  }
  .avator {
    span {
        cursor: pointer;
        font-size: 13px;
        text-align: center;
        margin-top: 10px;
    }
  }
  .fans_row {
    margin-top: 20px;
    .guan {
      padding-right: 10px;
      border-right: 1px solid darkgrey;
    }
    .fen {
      padding-left: 10px;
    }
    span {
      font-weight: bold;
      font-size: 15px;
    }
  }
  .win {
    img {
      cursor: pointer;
    }
  }
  input {
    width: 400px;
  }
  button.main {
    margin-top: 20px;
    margin-right: 20px;
    background-color: #a89dac;
  }
  button.exit {
    background-color: lightgrey;
  }
  .active {
    border: 2px solid lightcoral;
  }
}
</style>
