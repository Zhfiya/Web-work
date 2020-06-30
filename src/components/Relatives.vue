<template>
    <div id="relative" class="flex flex-row">
        <div class="flex flex-col center">
            <div class="flex flex-row">
                <b>搜用户</b>
                <input type="text" class="input-underline" v-model="findName">
                <button class="button se" @click="Find">搜索</button>
            </div>
            <div class="flex flex-row res_row" v-if="res">
                <img :src="this.res.portrait" alt="">
                <span class="name">{{ this.res.name }}</span>
                <span>等级：{{ this.res.level }}</span>
                <button class="button" @click="GetGuan">关注</button>
            </div>
            <div class="flex flex-row row">
                <span :class="{active_span:type === 'guan'}" @click="Select('guan')">我的关注</span>
                <span :class="{active_span:type === 'fen'}" @click="Select('fen')">我的粉丝</span>
            </div>
            <div class="flex flex-col" v-if="type === 'guan'">
                <div
                v-for="item in guanList"
                :key="item.u_id"
                class="flex flex-row re_row">
                    <img :src="item.portrait" alt="">
                    <span>id:{{ item.follower_id }}</span>
                    <span>用户名：{{ item.follower_name }}</span>
                    <button class="button" @click="DeleteGuan(item.follower_id)">取消关注</button>
                </div>
            </div>
            <div class="flex flex-col" v-if="type === 'fen'">
                <div class="flex flex-row re_row">
                    <img src="../assets/avator/1.jpg" alt="">
                    <span>id:1</span>
                    <span>用户名：fine</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'relative',
  data () {
    return {
      type: 'guan',
      findName: '',
      res: '',
      guanList: [],
      fanList: [],
    };
  },
  computed: {
    ...mapState(['uId']),
  },
  created () {
    this.Select('guan');
  },
  methods: {
    async Select (type) {
      var url = '';
      this.type = type;
      if (type === 'guan') {
        url = '/getFollowers';
      } else {
        url = '/getFans';
      }
      try {
        const res = await this.$axios.post(url, {
          u_id: this.uId,
        });
        const info = res.data;
        if (info.code === 200) {
          this.guanList = info.data;
          this.guanList.forEach(ele => {
            ele.portrait = require(`../assets/avator/${ele.portrait}.jpg`);
          });
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
    async Find () {
      try {
        const res = await this.$axios.post('/findUser', {
          name: this.findName,
        });
        const info = res.data;
        if (info.code === 200) {
          this.res = info.data;
          this.res.portrait = require(`../assets/avator/${this.res.portrait}.jpg`);
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
    async GetGuan () {
      try {
        const res = await this.$axios.post('/followPerson', {
          u_id: this.uId,
          spec_id: this.res.u_id,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '关注成功！',
          });
          this.Select('guan');
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
    async DeleteGuan (id) {
      try {
        const res = await this.$axios.post('/cancelFollowing', {
          u_id: this.uId,
          spec_id: id,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '取消关注成功！',
          });
          this.$router.go(0);
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
  }
};
</script>

<style lang="less" scoped>
#relative{
    margin-top: 110px;
    .center {
        margin-left: 100px;
        b {
            margin-top: 5px;
            margin-right: 10px;
        }
        button.se {
            margin-left: 10px;
            width: 70px;
            background-color:lightsteelblue;
            color: whitesmoke;
        }
        .row {
            margin-top: 50px;
            margin-bottom: 30px;
            span {
                cursor: pointer;
                padding: 10px 30px;
            }
            .active_span {
                border-bottom: 2px dashed darkgoldenrod;
                font-weight: bold;
                background-color: lightgoldenrodyellow;
            }
        }
        .res_row {
            margin-top: 20px;
            width: 400px;
            padding: 10px 20px;
            background-color: lightgrey;
            img {
                width: 70px;
                height: 70px;
            }
            span {
                font-weight: bold;
                margin-left: 60px;
                line-height: 70px;
            }
            .name {
                margin-left: 20px;
                font-size: 20px;
            }
            button {
                margin-left: 60px;
                margin-top: 20px;
                height: 30px;
            }
        }
        .re_row {
            padding: 10px 30px;
            border-bottom: 1px dashed #000;
            img {
                width: 50px;
                height: 50px;
            }
            span {
                margin-left: 30px;
                line-height: 50px;
            }
            button {

                margin-left: 50px;
                margin-top: 10px;
                height: 30px;
            }
        }
    }
}
</style>
