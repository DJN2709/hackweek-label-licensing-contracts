const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '/api'
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${req.method} ${req.path}`);
      }
    })
  );
}; 