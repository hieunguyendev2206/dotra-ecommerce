// eslint-disable-next-line no-undef
const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line no-undef
module.exports = function(app) {
    app.use(
        '/api-provinces',
        createProxyMiddleware({
            target: 'https://provinces.open-api.vn',
            changeOrigin: true,
            pathRewrite: { '^/api-provinces': '' },
        })
    );
};
