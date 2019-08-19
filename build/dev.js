process.env.NODE_ENV = 'dev';
const config = require('../config/webpack.dev.conf.js');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const path = require('path');

const host = '0.0.0.0';
const options = {
  contentBase: [path.join(__dirname, '../dist'), path.join(__dirname, '../static')],
  hot: true,
  host: host,
  proxy: {
    '/api': {
      // target: 'http://192.168.4.252:5103',
      target: 'https://mobile.licai.com',
      changeOrigin: true
    }
  }
  // disableHostCheck: true
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
// compiler.run(); // 得run一下才能开始运行。这个对应的文档在哪儿呀，我没找到
const server = new webpackDevServer(compiler, options);
server.listen(9000, host, () => {
  console.log('dev server listening on port 9000');
});
