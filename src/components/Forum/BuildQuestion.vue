<template>
    <div id="buildQues" class="flex flex-col background">
        <div class="flex flex-col info">
            <el-input
            type="textarea"
            :autosize="{ minRows: 10}"
            placeholder="请输入内容"
            v-model="content">
            </el-input>
        </div>
        <div class="flex flex-row tag_row">
            <span>帖子版块</span>
            <el-select v-model="tag" placeholder="请选择" size="small">
                <el-option
                v-for="item in tagList"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>
        <button class="button" @click="Submit">发表</button>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'buidQues',
  computed: {
    ...mapState(['uId']),
  },
  data () {
    return {
      content: '',
      tag: '',
      tagList: ['移动开发', '云计算', '区块链', '企业IT', '.NET技术', 'JAVA技术', 'Web技术', '开发语言/框架', '数据库开发', 'Linux社区', 'Windows专区',
        '嵌入式开发', '游戏开发', '网络与通信', '求职招聘', '其他技术', '灌水区', '扩充话题/反馈'],
    };
  },
  methods: {
    async Submit () {
      try {
        const res = await this.$axios.post('/addQuestion', {
          u_id: this.uId,
          content: this.content,
          tag: this.tag,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '发送成功',
          });
          window.location.href = '/forum';
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
  }
};
</script>

<style lang="less" scoped>
#buildQues{
    text-align: left;
    background-color: #f5f6f7;

    .info {
        background-color: #fff;
        padding: 20px;
        margin-top: 100px;
        width: 60%;
        margin-left: 20%;
    }
    .tag_row {
        margin-left: 20%;
        margin-top: 20px;
        span {
            margin-top: 5px;
            margin-right: 30px;
        }
    }
    button {
        margin-left: 20%;
        width: 100px;
        margin-top: 20px;
        background-color:lightsalmon;
    }
}
</style>
