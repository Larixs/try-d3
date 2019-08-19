const merge = require('webpack-merge');
const base = require('./webpack.config.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const entry = process.argv[2];
const srcPath = path.join(__dirname, '../src');
const fullDir = path.join(srcPath, entry);
const fs = require('fs');

function createHtmlWebpackPlugin() {
  try{
    const _path = path.resolve(fullDir, 'index.ejs');
    if(fs.existsSync(_path)){
      return new HtmlWebpackPlugin({
        template: _path
      })
    } else {
      return new HtmlWebpackPlugin();
    }
  }catch (e) {
    return new HtmlWebpackPlugin()
  }
}
let devconfig = merge(base, {
  mode: 'development',
  output: {
    // path: path.resolve(__dirname, '../dist'),
    filename: 'index.js'
  },
  plugins: [
    createHtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      staticPath: JSON.stringify('')
    })
  ]
});
module.exports = devconfig;
