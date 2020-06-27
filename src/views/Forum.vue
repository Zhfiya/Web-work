<template>
  <div id="forum" class="flex flex-row background" v-if="update">
    <div class="left flex flex-col">
      <div class="flex flex-row">
        <input type="text" class="input-underline" v-model="select">
        <i class="el-icon-search" @click="Select"></i>
      </div>
      <div
      @click="Cli('all')"
      class="flex flex-row index"
      :class="{active: type === 'all'}">
        <span>论坛首页</span>
      </div>
      <div
      @click="Cli('my')"
      class="flex flex-row my row"
      :class="{active: type === 'my'}">
        <i class="el-icon-notebook-2"></i>
        <span>我的论坛</span>
      </div>
      <div
      @click="Cli('star')"
      class="flex flex-row my row"
      :class="{active: type === 'star'}">
        <i class="el-icon-notebook-2"></i>
        <span>收藏的帖子</span>
      </div>
      <div class="flex flex-col">
        <div
        v-for="item in list"
        :key="item"
        class="flex flex-row row"
        @click="Cli(item)"
        :class="{active: type === item}">
          <i class="el-icon-notebook-2"></i>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col center" v-if="this.type === 'all' && selectRes.length === 0">
      <div class="center_box">
        <div class="flex flex-row title jy-between">
            <span>热帖·技术区</span>
            <span class="more">更多</span>
        </div>
        <ForumList :tag="tag1"/>
      </div>
      <div class="center_box">
        <div class="flex flex-row title jy-between">
            <span>热帖·非技术区</span>
            <span class="more">更多</span>
        </div>
        <ForumList :tag="tag2"/>
      </div>
    </div>
    <div class="flex flex-col center" v-if="this.type !== 'all' && selectRes.length === 0">
      <div class="center_box">
        <div class="flex flex-row title jy-between">
            <span>热帖·{{ this.type }}</span>
            <span class="more">更多</span>
        </div>
        <ForumList :tag="type"/>
      </div>
    </div>
    <div class="flex flex-col center" v-if="this.selectRes.length !== 0">
      <div class="center_box">
        <div class="flex flex-row title jy-between">
            <span>热帖·{{ this.select }}</span>
            <span class="more">更多</span>
        </div>
        <ForumList :res="selectRes"/>
      </div>
    </div>
    <div class="flex flex-col right">
      <button class="button" @click="GoBuild">我要发帖</button>
      <div class="tip">
        <span>论坛公告</span>
        <hr>
        欢迎来到F+技术论坛！<br>
        左侧是论坛索引，您可以查看对应tag的帖子或对帖子进行查询
      </div>
      <div class="rank fle flex-col">
        <span>排行榜</span>
        <hr>
        <div class="flex flex-col">
          <div
          v-for="item in UList"
          :key="item.id"
          class="flex flex-row jy-between rank_row">
          <div>
            <span class="rank_ap">{{ item.rank }}</span>
            <span>{{ item.name }}</span>
          </div>
          <span>{{ item.grade }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ForumList from '../components/Forum/ForumList';

export default {
  name: 'forum',
  components: {
    ForumList,
  },
  data () {
    return {
      list: ['移动开发', '云计算', '区块链', '企业IT', '.NET技术', 'JAVA技术', 'Web技术', '开发语言/框架', '数据库开发', 'Linux社区', 'Windows专区',
        '嵌入式开发', '游戏开发', '网络与通信', '求职招聘', '其他技术', '灌水区', '扩充话题/反馈'],
      search: '',
      type: 'all',
      tag1: '技术区',
      tag2: '非技术区',
      select: '',
      selectRes: [],
      UList: [],
      update: true,
    };
  },
  created () {
    this.GetRank();
  },
  methods: {
    Cli (type) {
      this.select = '';
      this.selectRes = [];
      this.type = type;
      this.Refresh();
    },
    Refresh () {
      this.update = false;
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
        this.update = true;
      });
    },
    GoBuild () {
      const { href } = this.$router.resolve({
        path: '/buildQuestion',
      });
      window.open(href, '_blank');
    },
    async Select () {
      try {
        const res = await this.$axios.post('/getQuestionByContent', {
          content: this.select,
        });
        const info = res.data;
        if (info.code === 200) {
          this.type = '';
          this.selectRes = info.data;
          if (info.data.length === 0) {
            this.$message({
              type: 'error',
              message: '暂无帖子',
            });
          } else {
            this.Refresh();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async GetRank () {
      try {
        const res = await this.$axios.post('/sortUserByGrade', {});
        const info = res.data;
        if (info.code === 200) {
          console.log(info.data);
          this.UList = info.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  }
};
</script>

<style lang="less" scoped>
#forum {
  margin-top: 60px;
  background-color: #f5f6f7;
  .active {
    color: red;
    text-decoration: underline;
  }
  .left {
    background-color: #D1DCE2;
    width: 200px;
    height: 100%;
    left: 0;
    box-shadow: 3px 0px 3px rgba(0,0,0,0.2);
    position: fixed;
    padding-left: 10px;
    padding-top: 15px;

    .row {
      font-size: 13px;
      padding: 5px;
      cursor: pointer;
      i {
        margin-top: 2px;
      }
    }
    .index {
      font-size: 14px;
      margin-bottom: 5px;
      cursor: pointer;
    }
    .my {
      color:orangered;
    }
    input {
      width: 170px;
      font-size: 13px;
      margin-bottom: 15px;
    }
    input:focus {
      border-color:darksalmon;
    }
    i {
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .center {
    margin-top: 50px;
    margin-left: 250px;
    .center_box {
      margin-bottom: 30px;
    }
  }
  .title {
    padding: 5px;
    width: 900px;
    background-color: #e3e6e8;
    span {
      font-weight: bold;
      margin-left: 10px;
    }
    span.more {
      font-weight: normal;
      font-size: 15px;
      cursor: pointer;
    }
  }
  .right {
    margin-top: 50px;
    margin-left: 30px;

    button {
      margin-bottom: 10px;
      background-color:lightslategrey;
      color: #fff;
    }
    .tip {
      text-align: left;
      width: 250px;
      padding: 10px;
      background-color: #fff;
      font-size: 14px;
      span {
        color: darkgrey;
        font-weight: bold;
      }
    }
    .rank {
      background-color: #fff;
      margin-top: 10px;
      text-align: left;
      padding: 10px;
      .rank_row {
        border-bottom: 1px solid lightgrey;
        padding: 5px;
      }
      .rank_ap {
        font-weight: bold;
        margin-right: 20px;
      }
    }
  }
}
</style>
