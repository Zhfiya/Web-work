exports.install = function (Vue) {
  Vue.prototype.Locate = function (route) {
    window.location.href = route;
  };
};
