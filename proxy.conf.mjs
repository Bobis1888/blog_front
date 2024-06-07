export default [
  {
    context: [
      '/api'
    ],
    target: process.env.PROXY_TARGET || 'http://127.0.0.1',
    secure: false,
    pathRewrite: {
      '^/api': ''
    }
  }
]
