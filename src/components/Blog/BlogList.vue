<template>
  <div id="blogList" class="flex flex-col" v-if="update">
    <div
    v-for="item in blogList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    :key="item.blog_id"
    class="flex flex-col blog">
      <div class="flex flex-row blog_row" @click="ToDetail(item)">
        <label class="tag">{{ item.tag }}</label>
        <label class="name">{{ item.name }}</label>
      </div>
      <div class="row flex jy-between">
        <div>
          <span><i class="el-icon-upload"></i>{{ item.upload_time }}</span>
          <span>|</span>
          <span><i class="el-icon-star-on"></i>获赞量：{{ item.like_num }}</span>
        </div>
        <div v-if="typeOfTime">
          <span class="update" @click="ToUpdate(item)">修改</span>
          <span>|</span>
          <span class="update" @click="confirm(item.blog_id)">删除</span>
        </div>
      </div>
    </div>
    <div v-if="blogList.length > 0">
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
  name: 'blogList',

  props: {
    type: {
      required: false
    },
    order: {
      required: false
    },
    tag: {
      required: false
    },
    typeOfTime: {
      required: false
    },
    blogs: {
      required: false
    }
  },

  computed: {
    ...mapState(['uId'])
  },

  data () {
    return {
      time: '2020-02-02 02:02:02',
      like: 0,
      blogList: [],
      countList: [],
      deteleBlogId: '',
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,

      update: true
    };
  },

  created () {
    // 个人博客
    if (this.type && this.order) {
      this.OrderBlog();
    }
    // 博客区
    if (this.tag) {
      this.OrderBlogArea();
    }
  },

  watch: {
    blogs (val) {
      if (val) {
        this.blogList = val;
        this.Count();
      }
    }
  },

  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.currentPage = val;
    },
    // 查看博客
    ToDetail (blog) {
      const blogId = blog.blog_id;
      this.$store.dispatch('set_blog', blog);
      const { href } = this.$router.resolve({
        path: '/blogDetail',
        query: { blogId: blogId }
      });
      window.open(href, '_blank');
    },

    // 修改博客
    ToUpdate (blog) {
      const blogId = blog.blog_id;
      const { href } = this.$router.resolve({
        path: '/buildBlog',
        query: { blogId: blogId }
      });
      window.open(href, '_blank');
    },

    // 删除博客
    confirm (blogId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deteleBlogId = blogId;
        this.DeteleBlog();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async DeteleBlog () {
      try {
        const res = await this.$axios.post('/deleteBlog', {
          blog_id: this.deteleBlogId
        });
        const info = res.data;
        console.log(info);
        if (info.code === 200) {
          this.update = false;
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          this.$nextTick(() => {
            this.update = true;
            this.OrderBlog();
          });
          this.deteleBlogId = '';
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
    },

    // 个人博客排序
    async OrderBlog () {
      try {
        if (this.order === 'time') {
          const res = await this.$axios.post('/sortBlogByTime', {
            u_id: this.uId,
            tag: this.type,
            typeOfTime: this.typeOfTime
          });
          const info = res.data;
          // console.log(info.data);
          if (info.code === 200) {
            this.blogList = info.data;
            this.totalCount = this.blogList.length;
            this.Count();
            this.$emit('count', this.countList);
          } else if (info.code === 409) {
            this.sessionJudge();
          }
        } else {
          const res = await this.$axios.post('/sortBlogByLike', {
            u_id: this.uId,
            tag: this.type
          });
          const info = res.data;
          if (info.code === 200) {
            this.blogList = info.data;
            this.totalCount = this.blogList.length;
            this.Count();
            this.$emit('count', this.countList);
          } else if (info.code === 409) {
            this.sessionJudge();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 博客区排序
    async OrderBlogArea () {
      try {
        const res = await this.$axios.post('/getAllBlog', {
          u_id: this.uId,
          tag: this.tag
        });
        const info = res.data;
        console.log(info);
        if (info.code === 200) {
          this.blogList = info.data;
          this.totalCount = this.blogList.length;
        } else if (info.code === 409) {
          this.sessionJudge();
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 计算博客数量及或赞数
    Count () {
      if (this.blogList) {
        let likeNum = 0;
        const blogNum = this.blogList.length;
        this.blogList.forEach((item) => {
          likeNum = likeNum + item.like_num;
        });
        this.countList = { likeNum: likeNum, blogNum: blogNum };
      } else {
        this.countList = { likeNum: 0, blogNum: 0 };
      }
    }
  }
};
</script>

<style lang="less" scoped>
#blogList {
  border: 1px solid white;
  border-width: 1px 0 0 0;

  .blog {
    background-color: #F7F7F7;
    margin-bottom: 10px;
    height: 80px;
    padding: 5px 15px;

    .blog_row {
      margin: 15px 0 0 10px;
      cursor: pointer;
      .tag {
        color: #F58813;
        background-color: #FCDF96;
        font-family: STFangsong;
        border-radius: 2px;
        padding: 2px;
        margin-right: 5px;
      }
    }
    label.name {
      font-size: 110%;
      font-weight: bold;
      cursor: pointer;
    }
    span {
      font-size: 90%;
      color: darkgray;
      font-weight: lighter;
      margin-left: 5px;
    }
    .row {
      margin: 10px 0 0 10px;

      .update {
        color: #BC3520;
        padding: 5px;
        cursor: pointer;
      }
    }
  }
  .page {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
