<template>
  <div id="forumList" class="flex flex-col">
    <div class="flex flex-row jy-start second">
      <span class="qtitle">标题</span>
      <span class="qauthor">提问人</span>
      <span>获赞数</span>
    </div>
    <div class="flex flex-col list" v-if="this.tag !== 'star'">
      <div
      v-for="item in list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :key="item.content"
      class="flex flex-row list_row"
      @click="GetDetail(item.question_id)">
        <span class="qtitle"><span class="tag">{{ item.tag }} ` </span>{{ item .content }}</span>
        <span class="qauthor">{{ item.author_name }}</span>
        <span>{{ item.like_num }}</span>
      </div>
    </div>
    <div class="flex flex-col list" v-else>
      <div
      v-for="item in list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :key="item.content"
      class="flex flex-row list_row">
        <span class="qtitle" @click="GetDetail(item.question_id)"><span class="tag">{{ item.tag }} ` </span>{{ item .content }}</span>
        <span class="qauthor">{{ item.author_name }}</span>
        <span class="num">{{ item.like_num }}</span>
        <span class="delete" @click="DeleteStar(item.question_id)">删除</span>
      </div>
    </div>
    <div v-if="list.length > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        class="page">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'forumList',
  data () {
    return {
      list: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
    };
  },
  computed: {
    ...mapState(['uId']),
  },
  created () {
    if (this.tag === 'my') {
      this.getMy();
    } else if (this.tag === 'star') {
      this.getUserQuesCollection();
    } else if (this.tag) {
      this.getList();
    } else if (this.res) {
      this.list = this.res;
    }
  },
  props: {
    tag: {
      required: false
    },
    res: {
      required: false
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.currentPage = val;
    },
    async getList () {
      try {
        const res = await this.$axios.post('/getAllQuestion', {
          tag: this.tag,
        });
        const info = res.data;
        if (info.code === 200) {
          this.list = info.data;
          this.totalCount = this.list.length;
          if (info.data.length === 0) {
            this.$message({
              type: 'error',
              message: '暂无帖子',
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getMy () {
      try {
        const res = await this.$axios.post('/sortQuestionByLike', {
          u_id: this.uId,
          tag: 'all',
        });
        const info = res.data;
        if (info.code === 200) {
          this.list = info.data;
          this.totalCount = this.list.length;
          if (info.data.length === 0) {
            this.$message({
              type: 'error',
              message: '暂无帖子',
            });
          }
        } else {
          this.$message({
            type: 'error',
            message: info.data,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    GetDetail (id) {
      const { href } = this.$router.resolve({
        path: '/forumDetail',
        query: { questionId: id }
      });
      window.open(href, '_blank');
    },
    async getUserQuesCollection () {
      try {
        const res = await this.$axios.post('/getUserQuesCollection', {
          u_id: this.uId,
        });
        const info = res.data;
        if (info.code === 200) {
          this.list = info.data;
          this.totalCount = this.list.length;
          if (info.data.length === 0) {
            this.$message({
              type: 'error',
              message: '暂无帖子',
            });
          }
        } else {
          this.$message({
            type: 'error',
            message: info.data,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async DeleteStar (id) {
      try {
        const res = await this.$axios.post('/deleteQuesCollection', {
          qc_id: id,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'error',
            message: '取消收藏',
          });
        } else {
          this.$message({
            type: 'error',
            message: info.data,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
#forumList{
  .second {
    background-color: #fafafa;
    padding: 3px;
    text-align: left;
  }
  .list {
    text-align: left;
    background-color: #fff;
    .list_row {
      padding: 10px 5px;
      border-bottom: 1px solid lightgray;
      cursor: pointer;
    }
  }
  .qtitle {
    margin-left: 10px;
    width: 600px;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
    .tag {
      color: lightskyblue;
    }
  }
  .qauthor {
    width: 150px;
  }
  .num {
    width: 100px;
  }
  .delete {
    cursor: pointer;
  }
}
</style>
