<template>
  <div id="forumDetail" class="flex flex-row jy-center background" v-if="update">
    <div class="flex flex-col center">
      <b>{{ this.title }}</b>
      <div class="flex flex-row jy-between head_row">
        <div class="flex flex-row">
          <div class="flex flex-row like_row">
            <img src="../../assets/dislike.png" alt="" v-if="isLike === 'false'" @click="ChangeLike('add')">
            <img src="../../assets/like.png" alt="" v-if="isLike === 'true'" @click="ChangeLike('reduce')">
            <span>({{ this.likeNum }})点赞</span>
            <span class="star" @click="AddStar">收藏</span>
          </div>
        </div>
        <div class="flex flex-row">
          <span>提问人：{{ this.author }}</span>
          <span class="time">{{ this.askTime }}</span>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="flex flex-col answers">
        <div
        v-for="item in list"
        :key="item.pass_time && item.author_id"
        class="flex flex-row answer_row">
          <img :src="item.portrait" alt="">
          <div class="flex flex-col left_row">
            <span>{{ item.content }}</span>
            <div class="flex flex-row like_row">
              <img src="../../assets/dislike.png" alt="" v-if="!item.is_like" @click="ChangeComLike(item.answer_id, 'add')">
              <img src="../../assets/like.png" alt="" v-if="item.is_like" @click="ChangeComLike(item.answer_id, 'reduce')">
              <span>({{ item.like_num }})点赞</span>
              <span>{{ item.pass_time }}</span>
              <span class="delete" @click="DeleteComment(item.answer_id)" v-if="item.is_person">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col write">
        <span>---写回复---</span>
        <el-input
        type="textarea"
        :autosize="{ minRows: 6}"
        placeholder="请输入内容"
        v-model="content">
        </el-input>
        <button class="button" @click="SubmitCom">发表</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'forumDetail',
  data () {
    return {
      title: '',
      author: '',
      authorId: 0,
      isLike: false,
      content: '',
      askTime: '',
      quesId: 0,
      likeNum: 0,
      Url: '',
      list: [],

      update: true,
    };
  },
  computed: {
    ...mapState(['uId']),
    ...mapState(['avator']),
    ...mapState(['uName']),
  },
  created () {
    this.Url = require(`../../assets/avator/${this.avator}.jpg`);
    this.quesId = this.$route.query.questionId;
    console.log(this.uName);
    this.GetDetail();
    this.GetComment();
  },
  methods: {
    async GetDetail () {
      try {
        const res = await this.$axios.post('/getQuestionDetail', {
          u_id: this.uId,
          question_id: this.quesId,
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          this.title = info.data.content;
          this.author = info.data.author_name;
          this.authorId = info.data.author_id;
          this.askTime = info.data.ask_time;
          this.likeNum = info.data.like_num;
          this.isLike = info.data.is_like;
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async GetComment () {
      try {
        const res = await this.$axios.post('/getAnswerInfo', {
          u_id: this.uId,
          question_id: this.quesId,
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          this.list = info.data;
          this.list.forEach(item => {
            item.portrait = require(`../../assets/avator/${item.portrait}.jpg`);
          });
        } else if (info.code === 409) {
          this.sessionJudge();
        } else {
          this.$message({
            type: 'warning',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async SubmitCom () {
      try {
        const res = await this.$axios.post('/writeAnswer', {
          u_id: this.uId,
          question_id: this.quesId,
          content: this.content,
          author_id: this.authorId,
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '评论成功',
          });
          this.content = '';
          this.Refresh();
        } else if (info.code === 409) {
          this.sessionJudge();
        } else {
          this.$message({
            type: 'warning',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async ChangeLike (type) {
      try {
        const res = await this.$axios.post('/updateQuestionLike', {
          u_id: this.uId,
          question_id: this.quesId,
          typeOfLike: type,
        });
        const info = res.data;
        if (info.code === 200) {
          if (type === 'add') {
            this.isLike = 'true';
            this.likeNum = this.likeNum + 1;
          } else {
            this.isLike = 'false';
            this.likeNum = this.likeNum - 1;
          }
        } else if (info.code === 409) {
          this.sessionJudge();
        } else {
          this.$message({
            type: 'warning',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async ChangeComLike (id, type) {
      try {
        const res = await this.$axios.post('/changeAnswerLike', {
          u_id: this.uId,
          answer_id: id,
          typeOfLike: type,
        });
        const info = res.data;
        if (info.code === 200) {
          this.Refresh();
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        } else if (info.code === 409) {
          this.sessionJudge();
        } else {
          this.$message({
            type: 'warning',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async DeleteComment (id) {
      try {
        const res = await this.$axios.post('/deleteAnswer', {
          answer_id: id,
        });
        const info = res.data;
        if (info.code === 200) {
          this.list = [];
          this.Refresh();
          this.$message({
            type: 'success',
            message: '删除成功',
          });
        } else if (info.code === 409) {
          this.sessionJudge();
        } else {
          this.$message({
            type: 'warning',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async AddStar () {
      this.$confirm('是否收藏该帖子？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.$axios.post('/collectQuestion', {
            u_id: this.uId,
            question_id: this.quesId,
          });
          const info = res.data;
          if (info.code === 200) {
            this.$message({
              type: 'success',
              message: '收藏成功',
            });
          } else if (info.code === 409) {
            this.sessionJudge();
          } else {
            this.$message({
              type: 'warning',
              message: info.message,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消收藏'
        });
      });
    }
  },
};
</script>

<style lang="less" scoped>
#forumDetail{
  margin-top: 60px;
  background-color: #fff;
  .center {
    margin-top: 20px;
    background-color: #f5f6f7;
    width: 60%;
    text-align: left;
    padding: 20px;
    span {
      margin-left: 10px;
    }
    span.time {
      font-size: 14px;
      color: darkgrey;
    }
    b {
      margin-left: 20px;
      font-size: 20px;
    }
    .head_row {
      background-color: #f7f7fd;
      margin-top: 10px;
      margin-left: 20px;
      padding: 10px;
      i {
        margin-right: 5px;
      }
      .star {
        cursor: pointer;
      }
    }
    .answers {
      img {
        width: 60px;
        height: 60px;
        margin-right: 20px;
      }
      .answer_row {
        margin-top: 20px;
        height: 100%;
        padding-bottom: 20px;
        border-bottom: 1px solid darkgrey;
      }
      .left_row {
        padding: 5px 10px;
        border-left: 1px dashed darkgrey;
        span {
          margin-bottom: 20px;
        }
      }
    }
    .like_row {
      img {
        cursor: pointer;
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
      span {
        margin-top: 2px;
        font-size: 13px;
        color: #e8989a;
        margin-right: 20px;
      }
      span.star {
        cursor: pointer;
      }
    }
    .write {
      margin-top: 50px;
      margin-left: 20px;
      font-weight: bold;
      span {
        margin-bottom: 10px;
        color: burlywood;
      }
      button {
        margin-top: 10px;
        width: 100px;
        background-color:darkseagreen;
      }
    }
    .delete {
      cursor: pointer;
    }
  }
}
</style>
