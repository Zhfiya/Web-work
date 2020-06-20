exports.install = function (Vue) {
  Vue.prototype.Locate = function (route) {
    window.location.href = route;
  };
  Vue.prototype.Refresh = function () {
    this.update = false;
    // 在组件移除后，重新渲染组件
    // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
    this.$nextTick(() => {
      this.GetComment();
      this.update = true;
    });
  };
};
