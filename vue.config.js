module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://47.94.228.189:2322',
        changeOrigin: true,
        ws: true,
      },
    },
  },
};
