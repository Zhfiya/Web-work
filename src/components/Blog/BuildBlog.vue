<template>
    <div id="buildBlog" class="flex felx-row jy-between">
        <div class="write flex flex-col">
            <label for="title">撰写文章</label>
            <input type="text" id="title" v-model="title" placeholder="标题...">
            <div class="edit">
                <mavon-editor
                v-model="content"
                ref="md"
                @change="change"
                style="min-height: 600px"
                />
            </div>
            <button @click="SubmitBlog" class="button"><i class="el-icon-finished"></i>提交</button>
        </div>
        <div class="tag_list flex flex-col">
            <div class="row flex flex-row">
                <label><i class="el-icon-collection-tag"></i>分类：</label>
            </div>
            <span
                v-for="item in tags"
                :key="item"
                @click="SelectTag(item)"
                :class="{active:tag===item}"
                class="flex felx-row">
                <i class="el-icon-d-arrow-right"></i>
                {{ item }}
            </span>
            <label class="tip"><i class="el-icon-warning-outline"></i>分类必选</label>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
export default {
  name: 'buildBlog',
  components: {
    mavonEditor
  },

  computed: {
    ...mapState(['uId'])
  },

  props: {
    blogInfo: {
      required: false
    }
  },

  data () {
    return {
      tag: '',
      title: '',
      content: '',
      html: '',
      blogId: 0,
      tags: ['前端', '架构', 'Java', 'Python', '人工智能', '区块链', '数据库', '5G', '游戏开发', '移动开发', '运维',
        '安全', '计算机基础', '物联网', 'AI', '其他'],
    };
  },

  created () {
    if (this.$route.query.blogId) {
      this.blogId = this.$route.query.blogId;
      this.GetBlogDetail();
    }
  },

  methods: {
    // 选择tag
    SelectTag (tag) {
      this.tag = tag;
    },

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
          this.content = infodata.content;
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },

    change (value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },

    // 表单验证
    VailDate () {
      let res = true;
      if (this.title === '') {
        this.$message({
          type: 'warning',
          message: '未填写标题！'
        });
        res = false;
      } else if (this.tag === '') {
        this.$message({
          type: 'warning',
          message: '未选择分类！'
        });
        res = false;
      } else if (this.content === '') {
        this.$message({
          type: 'warning',
          message: '未撰写博客！'
        });
        res = false;
      }
      return res;
    },

    // 提交博客
    SubmitBlog () {
      try {
        if (this.blogId === 0) {
          this.NewBlog();
        } else {
          this.UpdateBlog();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 提交博客
    async NewBlog () {
      if (this.VailDate()) {
        try {
          const res = await this.$axios.post('/addBlog', {
            u_id: this.uId,
            name: this.title,
            html: this.html,
            content: this.content,
            tag: this.tag
          });
          const info = res.data;
          console.log(info);
          if (info.code === 200) {
            this.blogId = info.data;
            this.$message({
              type: 'success',
              message: '提交成功'
            });
          } else if (info.code === 409) {
            this.sessionJudge();
          } else {
            this.$message({
              type: 'error',
              message: info.message
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    // 修改博客
    async UpdateBlog () {
      try {
        const res = await this.$axios.post('/updateBlog', {
          blog_id: this.blogId,
          name: this.title,
          html: this.html,
          content: this.content,
          tag: this.tag
        });
        const info = res.data;
        console.log(info);
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        } else if (info.code === 409) {
          this.sessionJudge();
        } else {
          this.$message({
            type: 'error',
            message: info.message
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
#buildBlog {
  margin-top: 110px;
  margin-left: 200px;

  .write {
    width: 100%;
    margin-right: 20px;

    label {
      cursor: pointer;
      font-size: 120%;
      font-weight: bold;
      margin-bottom: 20px;
    }
    input {
      width: 100%;
      outline: none;
      text-indent: 8px;
      height: 25px;
      font-size: 110%;
      text-decoration: none;
    }
    .edit {
      margin: 30px 0;
      z-index: 300;
    }
    button {
      margin-bottom: 100px;
      width: 100px;
      background-color: #CB7070;
      color: white;
    }
  }
  .tag_list {
    width: 250px;
    height: 700px;
    margin-right: 50px;
    padding: 20px;
    background-color: #F7F7F7;
    box-shadow: 3px 3px 3px #D9D9D9;

    .row {
      margin-bottom: 5%;
    }
    label {
      color: #BC3520;
    }
    span {
      font-size: 90%;
      margin: 5% 10%;
      cursor: pointer;
    }
    .tip {
      color: #CB6262;
      margin-top: 10px;
      margin-left: 70px;
      font-size: 80%;
    }
    span:hover {
      color: #BC3520;
    }
    .active {
        color: brown;
    }
  }
}
</style>
