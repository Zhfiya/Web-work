<template>
    <div id="forumList" class="flex flex-col">
        <div class="flex flex-row jy-start second">
            <span class="qtitle">标题</span>
            <span class="qauthor">提问人</span>
            <span>获赞数</span>
        </div>
        <div class="flex flex-col list">
            <div
            v-for="item in list"
            :key="item.content"
            class="flex flex-row list_row">
                <span class="qtitle"><span class="tag">{{ item.tag }} ` </span>{{ item .content }}</span>
                <span class="qauthor">{{ item.author_name }}</span>
                <span>{{ item.like_num }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'forumList',
  data () {
    return {
      list: [],
    };
  },
  created () {
    if (this.tag) {
      this.getList();
    } else if (this.res) {
      console.log(this.res);
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
    async getList () {
      try {
        const res = await this.$axios.post('/getAllQuestion', {
          tag: this.tag,
        });
        const info = res.data;
        if (info.code === 200) {
          this.list = info.data;
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
  }
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
}
</style>
