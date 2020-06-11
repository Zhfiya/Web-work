<template>
  <div id="personalCenter" class="background">
    <div class="title">
      <b><i class="el-icon-user"></i>个人资料</b>
    </div>
    <div class="flex flex-row card">
        <div class="flex flex-col avator">
            <img src="../assets/1.jpg" alt="">
            <span>修改头像</span>
        </div>
        <div class="flex flex-col">
            <div class="flex flex-row row">
                <label>用户名</label>
                <span>{{ this.name }}</span>
            </div>
            <div class="flex flex-row row">
                <label>性别</label>
                <span>{{ this.sex }}</span>
            </div>
            <div class="flex flex-row row">
                <label>生日</label>
                <span>{{ this.birth }}</span>
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
                <span>{{ this.intro }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'personalCenter',
  data () {
    return {
      name: 'Fine',
      birth: '2000/05/27',
      sex: '女',
      email: 'Paranoid_ZH@163.com',
      level: 5,
      intro: '啊哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
      portrait: 1,
    };
  }
};
</script>

<style lang="less" scoped>
#personalCenter{
  margin-top: 60px;
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
}
</style>
