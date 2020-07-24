<template>
  <div id="starBlogs" class="flex flex-row jy-start blogs" v-if="update">
      <div class="flex flex-col">
        <div class="flex flex-row jy-between row">
          <i class="el-icon-folder-opened">收藏夹列表</i>
          <el-popover
          placement="right"
          width="300"
          trigger="click">
          <el-input v-model="addName"></el-input>
          <el-button @click="AddFolder" size="small" type="info" plain>add</el-button>
          <span slot="reference"><i class="el-icon-folder-add"></i>创建收藏夹</span>
          </el-popover>
        </div>
        <div
        v-for="(item, index) in Folder"
        :key="item.favorites_id"
        class="flex flex-col it"
        :class="{active:name === item.favorites_name}">
          <div class="flex flex-row jy-betwwen">
            <div class="floder_row" @click="GetFoldDetail(item.favorites_id, item.favorites_name)">
              <i class="el-icon-folder-opened" v-if="!item.is_null"></i>
              <i class="el-icon-folder" v-else></i>
              {{ item.favorites_name }}
            </div>
            <el-popover
            placement="right"
            width="300"
            trigger="click"
            v-if="index !== 0">
            <el-input v-model="newName"></el-input>
            <el-button @click="EditFolder(item.favorites_id)" size="small" type="success" plain>修改收藏夹名字</el-button>
            <span slot="reference"><i class="el-icon-edit"></i></span>
            </el-popover>
            <i class="el-icon-circle-close" @click="DeleteFolder(item.favorites_id)" v-if="index !== 0"></i>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'starBlogs',
  computed: {
    ...mapState(['uId']),
  },
  data () {
    return {
      Folder: [],
      addName: '',
      newName: '',
      favoritesList: [],
      name: '',

      update: true,
    };
  },
  created () {
    this.GetFolder();
  },
  methods: {
    async GetFolder () {
      try {
        const res = await this.$axios.post('/getUserFavorites', {
          u_id: this.uId,
        });
        const info = res.data;
        if (info.code === 200) {
          this.Folder = info.data;
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
    async AddFolder () {
      try {
        const res = await this.$axios.post('/createFavorites', {
          u_id: this.uId,
          favorites_name: this.addName,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功',
          });
          this.update = false;
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          this.$nextTick(() => {
            this.GetFolder();
            this.update = true;
          });
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
    async EditFolder (id) {
      try {
        const res = await this.$axios.post('/updateFavoritesName', {
          u_id: this.uId,
          favorites_name: this.newName,
          favorites_id: id,
        });
        const info = res.data;
        if (info.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          });
          this.newName = '';
          this.update = false;
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          this.$nextTick(() => {
            this.GetFolder();
            this.update = true;
          });
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
    async DeleteFolder (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.$axios.post('/deleteFavorites', {
            favorites_id: id,
          });
          const info = res.data;
          if (info.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功',
            });
            this.newName = '';
            this.update = false;
            // 在组件移除后，重新渲染组件
            // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
            this.$nextTick(() => {
              this.GetFolder();
              this.update = true;
            });
          } else {
            this.$message({
              type: 'error',
              message: info.message,
            });
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
    },
    async GetFoldDetail (id, name) {
      try {
        this.name = name;
        const res = await this.$axios.post('/getFavoritesCollection', {
          favorites_id: id,
        });
        const info = res.data;
        if (info.code === 200) {
          this.favoritesList = info.data;
          if (!this.favoritesList) {
            this.favoritesList = 'no collects';
          }
          // 传值给父组件
          this.$emit('func', this.favoritesList);
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
#starBlogs{
  .row {
    width: 300px;
    span {
      font-size: 14px;
      color: brown;
      cursor: pointer;
    }
  }
  i {
    margin-top: 3px;
  }
  .it {
    margin-left: 20px;
    text-align: left;
    margin-top: 20px;
    .floder_row {
      width: 250px;
      font-size: 15px;
      cursor: pointer;
    }
    i {
      cursor: pointer;
      margin-right: 5px;
    }
  }
  .active {
    color: brown;
    font-weight: bold;
  }
}
</style>
