module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api',
        ws: true, // 如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': ''
        }
      },
      '/gui': {
        target: 'http://localhost:8080/gui',
        ws: true, // 如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/gui': ''
        }
      }
    }
  }
}
