module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/platform': {
        target: 'http://47.94.228.198:2322',
        changeOrigin: true,
        ws: true
      }
    }
  }
};
