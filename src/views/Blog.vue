<template>
    <div id="blogArea" class="flex flex-row">
        <div class="left flex flex-col">
            <div class="tags flex flex-col">
                <label name="tag" @click="SelectType('all')" :class="{active:type==='all'}">
                    <i class="el-icon-magic-stick"></i>推荐
                </label>
                <label
                name="tag"
                v-for="item in tags"
                :key="item"
                @click="SelectType(item)"
                :class="{active:type===item}">
                    {{ item }}
                </label>
            </div>
        </div>
        <div class="blog">
            <div class="block">
                <el-carousel height="285px">
                    <el-carousel-item v-for="item in 4" :key="item">
                        <h3>更多热点，敬请期待</h3>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="flex flex-row jy-end select_row">
                <div class="input_box">
                    <el-input
                    placeholder="请输入内容"
                    v-model="select"
                    clearable
                    size="small">
                    </el-input>
                </div>
                <button class="button search" @click="SelectBlog">搜索</button>
            </div>
            <BlogList :tag="type" :blogs="blogList" v-if="update"/>
        </div>
        <div class="info flex flex-col">
            <span>若您对此平台有疑问，或想对此平台提出建议改进，发送邮件至：Paranoid_ZH@163.com</span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import BlogList from '../components/Blog/BlogList';

export default {
  name: 'blogArea',
  components: {
    BlogList
  },

  computed: {
    ...mapState(['uId'])
  },

  data () {
    return {
      type: 'all',
      update: true,
      select: '',
      blogList: [],
      tags: ['前端', '架构', 'Java', 'Python', '人工智能', '区块链', '数据库', '5G', '游戏开发', '移动开发', '运维',
        '安全', '计算机基础', '物联网', 'AI', '其他'],
    };
  },

  methods: {
    // 选择查看博客类型
    SelectType (type) {
      this.type = type;
      this.update = false;
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
        this.update = true;
      });
    },

    // 搜索博客
    async SelectBlog () {
      try {
        const res = await this.$axios.post('/findBlogName', {
          u_id: this.uId,
          name: this.select
        });
        const info = res.data;
        console.log(info);
        if (info.code === 200) {
          this.blogList = info.data;
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
#blogArea {
    margin-top: 80px;

    .left {
        position: fixed;
        margin-left: 150px;
        text-align: center;
    }
    .info {
        width: 210px;
        height: 150px;
        margin-left: 20px;
        padding: 5px;
        background-color: #F1F1F1;
        font-size: 14px;
        border-radius: 5px;
        span {
            letter-spacing: 5px;
            word-break: break-word;
            text-align: left;
            padding: 10px;
        }
    }
    .tags {
        text-align: center;
        width: 120px;
        background-color: #F1F1F1;
        label {
            border-radius: 2px;
            padding: 8px 10px;
            padding-left: 15px;
            cursor: pointer;
        }
        i {
            margin-right: 5px;
        }
    }
    .blog {
        margin-left: 340px;
        width: 870px;

        .block {
            margin-bottom: 10px;
        }
        .el-carousel__item h3 {
            color:black;
            text-align: center;
            font-size: 20px;
            opacity: 0.75;
            line-height: 150px;
            margin: 0;
        }

        .el-carousel__item:nth-child(2n) {
            background:url('../assets/y.jpg');
        }

        .el-carousel__item:nth-child(2n+1) {
            background:url('../assets/xing.jpg');
        }
        .select_row {
            width: 100%;
            margin-bottom: 30px;
            font-size: 22px;
            line-height: 24px;
            text-align: right;
            color: #CB7070;
            i {
                margin-right: 5px;
                margin: 3px;
            }
        }
        button {
            padding: 5px 20px;
            background-color: rgb(234, 179, 114);
            color: #F8F9F9;
            margin-left: 10px;
        }
        button:hover {
            box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.17);
        }
    }
    .active {
        background-color: rgb(147, 156, 97);
        color: white;
    }
}
</style>
