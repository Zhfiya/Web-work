<template>
  <div id="blogDetail" class="flex flex-col" v-if="update">
    <div class="center flex flex-col">
      <label class="title flex">{{ this.title }}</label>
      <div class="row flex flex-row jy-between">
        <div>
          <span class="tag">{{ this.tag }}</span>
          <span class="author">{{ this.author }}</span>
          <span>发布于{{ this.uploadTime }}</span>
          <span>
            点赞数：{{ this.like }}
            <i @click="Star('reduce')" class="el-icon-star-on" v-if="isLike === 'true'"></i>
            <i @click="Star('add')" class="el-icon-star-off" v-else></i>
          </span>
        </div>
        <span class="star" @click="GetFolder">收藏</span>
      </div>
      <div class="flex contents" v-html="content"></div>
    </div>
    <div class="discuss flex flex-col">
      <div class="flex flex-row">
        <span class="ping">评论</span>
      </div>
      <div class="flex flex-col list" v-if="list.length>0">
        <div
        v-for="item in list"
        :key="item.name && item.pass_time && item.content"
        class="felx flex-row row">
          <div class="flex flex-col">
            <div class="flex">
              <img :src="item.portrait" alt="" class="ava">
              <span class="content">{{ item.content }}</span>
            </div>
            <div class="flex flex-row jy-between">
              <span class="time">{{ item.name }}</span>
              <div class="flex flex-row">
                <span class="delete" @click="DeleteComment(item.comment_id, item.name)">删除</span>
                <img src="../../assets/dislike.png" alt="" v-if="!item.is_like" @click="StarComment('add', item.comment_id)">
                <img src="../../assets/like.png" alt="" v-if="item.is_like" @click="StarComment('reduce', item.comment_id)">
                <span class="time">{{ item.pass_time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="zanwu" v-if="list.length === 0">
        <span>暂无评论</span>
      </div>
      <div class="flex flex-row">
        <span>发表评论</span>
      </div>
      <div class="flex flex-col comment_row">
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="discontent">
        </el-input>
        <button class="button" @click="SubmitComment">提交</button>
      </div>
    </div>
    <el-dialog
      title="选择收藏夹"
      :visible.sync="dialogVisible"
      width="30%"
      class="dialog">
      <div class="flex flex-col">
        <div
        v-for="(item, index) in Folder"
        :key="item.favorites_id"
        class="flex flex-col it"
        :class="{active:selectIndex === index}">
          <div class="floder_row" @click="SelectFolder(index, item)">
            <i class="el-icon-folder-opened" v-if="!item.is_null"></i>
            <i class="el-icon-folder" v-else></i>
            {{ item.favorites_name }}
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Collect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'blogDetail',

  data () {
    return {
      title: '',
      tag: '',
      author: '',
      uploadTime: '',
      like: 0,
      isLike: '',
      blogId: 0,
      content: '',
      list: [],
      discontent: '',
      author_id: 0,
      Folder: [],
      selectIndex: -1,
      selectIId: -1,

      update: true,
      dialogVisible: false,
    };
  },

  computed: {
    ...mapState(['uId']),
    ...mapState(['uName']),
  },

  created () {
    this.blogId = this.$route.query.blogId;
    this.GetBlogDetail();
    this.GetComment();
  },

  methods: {
    // 获取blog
    async GetBlogDetail () {
      try {
        const res = await this.$axios.post('/getBlogDetail', {
          u_id: this.uId,
          blog_id: this.blogId
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          const infodata = info.data;
          this.title = infodata.name;
          this.tag = infodata.tag;
          this.uploadTime = infodata.upload_time;
          this.author_id = infodata.author_id;
          this.like = infodata.like_num;
          this.isLike = infodata.is_like;
          this.content = infodata.html;
          this.author = infodata.author_name;
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 点赞
    async Star (typeOfLike) {
      try {
        const res = await this.$axios.post('/changeLike', {
          u_id: this.uId,
          blog_id: this.blogId,
          typeOfLike: typeOfLike
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          if (typeOfLike === 'add') {
            this.Like = this.like++;
            this.isLike = 'true';
          } else {
            this.Like = this.like--;
            this.isLike = 'false';
          }
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 评论点赞
    async StarComment (typeOfLike, id) {
      try {
        const res = await this.$axios.post('/changeCommentLike', {
          u_id: this.uId,
          comment_id: id,
          typeOfLike: typeOfLike
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          this.Refresh();
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 删除评论
    async DeleteComment (id, name) {
      console.log(this.uName);
      if (this.uName === name) {
        this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const res = await this.$axios.post('/deleteComment', {
              comment_id: id,
            });
            const info = res.data;
            // console.log(info);
            if (info.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.list = [];
              this.Refresh();
            } else if (info.code === 409) {
              this.sessionJudge();
            }
          } catch (err) {
            console.log(err);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message({
          type: 'error',
          message: '您无法删除该评论'
        });
      }
    },
    // 获取评论
    async GetComment () {
      try {
        const res = await this.$axios.post('/getCommentInfo', {
          u_id: this.uId,
          blog_id: this.blogId,
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          this.list = info.data;
          this.list.forEach(element => {
            element.portrait = require(`../../assets/avator/${element.portrait}.jpg`);
          });
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 评论
    async SubmitComment () {
      try {
        const res = await this.$axios.post('/writeComment', {
          u_id: this.uId,
          blog_id: this.blogId,
          content: this.discontent,
          author_id: this.author_id,
        });
        const info = res.data;
        // console.log(info);
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '评论成功',
          });
          this.Refresh();
          this.discontent = '';
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 获取收藏夹
    async GetFolder () {
      try {
        const res = await this.$axios.post('/getUserFavorites', {
          u_id: this.uId,
        });
        const info = res.data;
        if (info.code === 200) {
          this.Folder = info.data;
          this.dialogVisible = true;
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
    SelectFolder (index, item) {
      this.selectIndex = index;
      this.selectIId = item.favorites_id;
    },
    async Collect () {
      try {
        const res = await this.$axios.post('/collectObject', {
          u_id: this.uId,
          favorites_id: this.selectIId,
          content_id: this.blogId,
          item: 'blog',
          collection_name: this.title,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '收藏成功！',
          });
          this.dialogVisible = true;
          this.dialogVisible = false;
        } else {
          this.$message({
            type: 'error',
            message: info.message,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="less" scoped>
#blogDetail {
  margin-top: 60px;
    margin-top: 7%;
    margin-left: 15%;
    width: 70%;

  .dialog {
    text-align: left;
    .it {
      margin: 10px 0;
    }
    .floder_row {
      cursor: pointer;
    }
    .active {
      color: brown;
    }
  }
  .center {
    padding: 30px;
    background-color: #F3F3F4;
    border-radius: 5px;

    .title {
      font-weight: bold;
      font-size: 140%;
    }
    .row {
      margin: 20px 0;
      border: 1px solid #DDDDDD;
      border-width: 0 0 1px 0;
      padding: 5px 0;

      .tag {
        color: #14B508;
        background-color: #BCDDB9;
        border-radius: 2px;
        padding: 2px;
      }
      .author {
        color: #BC3520;
      }
      span {
        margin-right: 10px;
        color: #959698;
        font-family: STFangsong;
      }
      i {
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .star {
      cursor: pointer;
    }
    .contents {
      text-align: left;
    }
  }
  .discuss {
    margin-top: 50px;
    .ping {
      font-size: 20px;
      padding: 5px;
      background-color:lightgoldenrodyellow;
    }
    .list {
      margin-top: 20px;
      margin-bottom: 100px;
    }
    .zanwu {
      margin: 20px 0;
      color: lightcoral;
      font-weight: bold;
      font-size: 18px;
    }
    .row {
      text-align: left;
      padding: 10px 20px;
      border-bottom: 1px dashed;
      margin-bottom: 10px;

      span {
        margin-left: 10px;
        word-break: break-all;
      }
      .delete {
        margin-top: 5px;
        margin-right: 5px;
        font-size: 12px;
        color: #e8989a;
        cursor: pointer;
      }
      .ava {
        margin-right: 20px;
        width: 50px;
        height: 50px;
        cursor: pointer;
      }
      .time {
        font-size: 12px;
        color: darkgrey;
        margin: 5px 0 0 15px;
      }
    }
    img {
      margin-top: 2px;
      width: 25px;
      height: 25px;
      cursor: pointer;
    }
    .comment_row {
      margin-top: 10px;
      margin-bottom: 50px;
      button {
        margin-top: 10px;
        width: 70px;
        background-color:lightsteelblue;
      }
    }
  }
}
</style>
