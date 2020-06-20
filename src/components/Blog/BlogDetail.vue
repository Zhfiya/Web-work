<template>
    <div id="blogDetail" class="flex flex-col">
        <div class="center flex flex-col">
            <label class="title flex">{{ this.title }}</label>
            <div class="row flex flex-row">
                <span class="tag">{{ this.tag }}</span>
                <span class="author">{{ this.author }}</span>
                <span>发布于{{ this.uploadTime }}</span>
                <span>
                    点赞数：{{ this.like }}
                    <i @click="Star('reduce')" class="el-icon-star-on" v-if="isLike === 'true'"></i>
                    <i @click="Star('add')" class="el-icon-star-off" v-else></i>
                </span>
            </div>
            <div class="flex contents" v-html="content"></div>
        </div>
        <div class="discuss flex flex-col">
            <div class="flex flex-row">
               <span class="ping">评论</span>
            </div>
            <div class="flex flex-col list">
                <div
                v-for="item in list"
                :key="item.name"
                class="felx flex-row row jy-between">
                    <div>
                        <img src="../../assets/1.jpg" alt="">
                        <span class="name">{{ item.name }}：</span>
                        <span class="content">{{ item.content }}</span>
                    </div>
                </div>
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
                <button class="button">提交</button>
            </div>
        </div>
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
      list: [{ name: 'fine', content: '啊啊啊啊aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa啊' }, { name: 'jv', content: 'hahah' }],
      discontent: '',
    };
  },

  computed: {
    ...mapState(['uId'])
  },

  created () {
    this.blogId = this.$route.query.blogId;
    console.log(this.blogId);
    this.GetBlogDetail();
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
    .contents {
        text-align: left;
    }
  }
    .discuss {
        margin-top: 50px;
        .ping {
            font-size: 20px;
            padding: 5px;
        }
        .list {
            margin-top: 20px;
            margin-bottom: 100px;
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
        }
        img {
            width: 50px;
            height: 50px;
        }
        .comment_row {
            margin-top: 10px;
            margin-bottom: 50px;
            button {
                margin-top: 10px;
                width: 100px;
            }
        }
    }
}
</style>
