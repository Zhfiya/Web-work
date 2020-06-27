<template>
  <div id="forum" class="flex flex-row">
    <div class="left flex flex-col">
      <div class="flex flex-row">
        <input type="text" class="input-underline">
        <i class="el-icon-search"></i>
      </div>
      <div
      @click="Cli('index')"
      class="flex flex-row index"
      :class="{active: type === 'index'}">
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
    <div>
      <ForumList />
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
        '嵌入式开发', '游戏开发', '网络与通信', '求职招聘', '其他技术', '扩充话题/反馈'],
      search: '',
      type: 'index',
    };
  },
  methods: {
    Cli (type) {
      this.type = type;
    },
  }
};
</script>

<style lang="less" scoped>
#forum {
  margin-top: 60px;
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
      color:lightcoral;
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
}
</style>
