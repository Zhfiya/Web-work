<template>
  <div id="forumDetail" class="flex flex-row jy-center background">
    <div class="flex flex-col center">
      <span><b>{{ this.title }}</b></span>
        <div class="flex flex-row jy-between head_row">
          <div class="flex.flex-row star" @click="ChangeLike">
            <i class="el-icon-star-off" v-if="!isLike"></i>
            <i class="el-icon-star-on" v-if="isLike"></i>
            收藏
          </div>
        <div class="flex flex-row">
          提问人：{{ this.author }}
        </div>
        </div>
        <el-divider></el-divider>
        <div class="flex flex-col answers">
          <div class="flex flex-row answer_row">
            <img :src="this.Url" alt="">
            <div class="flex flex-col left_row">
              <span>我猜你这次是不小心忘记啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</span>
              <div class="flex flex-row like_row">
                <img src="../../assets/dislike.png" alt="">
                <img src="../../assets/like.png" alt="">
                <span>(0)点赞</span>
                <span>3分钟前</span>
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
      quesId: 0,
      Url: '',
    };
  },
  computed: {
    ...mapState(['uId']),
    ...mapState(['avator']),
  },
  created () {
    this.Url = require(`../../assets/avator/${this.avator}.jpg`);
    this.quesId = this.$route.query.questionId;
    console.log(this.quesId);
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
        console.log(info);
        if (info.code === 200) {
          this.title = info.data.content;
          this.author = info.data.author_name;
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
        console.log(info);
        if (info.code === 200) {
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
        console.log(info);
        if (info.code === 200) {
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
    ChangeLike () {
      this.isLike = !this.isLike;
    },
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
                img {
                    width: 24px;
                    height: 24px;
                    margin-right: 5px;
                }
                .like_row {
                    margin-top: 20px;
                    span {
                        margin-top: 2px;
                        font-size: 13px;
                        color: #e8989a;
                        margin-right: 20px;
                    }
                }
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
    }
}
</style>
