<template>
    <div id="relative" class="flex flex-row">
        <div class="flex flex-col center">
            <div class="flex flex-row">
                <b>搜用户</b>
                <input type="text" class="input-underline">
                <button class="button">搜索</button>
            </div>
            <div class="flex flex-row row">
                <span :class="{active_span:type === 'guan'}" @click="Select('guan')">我的关注</span>
                <span :class="{active_span:type === 'fen'}" @click="Select('fen')">我的粉丝</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'relative',
  data () {
    return {
      type: 'guan',
    };
  },
  methods: {
    Select (type) {
      this.type = type;
    },
  }
};
</script>

<style lang="less" scoped>
#relative{
    margin-top: 110px;
    .center {
        margin-left: 100px;
        b {
            margin-top: 5px;
            margin-right: 10px;
        }
        button {
            margin-left: 10px;
            width: 70px;
            background-color:lightsteelblue;
            color: whitesmoke;
        }
        .row {
            margin-top: 50px;
            span {
                cursor: pointer;
                margin-right: 20px;
            }
            .active_span {
                border-bottom: 2px dashed darkgoldenrod;
            }
        }
    }
}
</style>
