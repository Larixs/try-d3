const path = require("path");
const entry = process.argv[2];
const srcPath = path.join(__dirname, '../src');
const fullDir = path.join(srcPath, entry);
const fs = require('fs');

let webpackConfig = {
  entry: {
    [entry]: fs.existsSync(path.resolve(fullDir, 'index.ts')) ?
                path.resolve(fullDir, 'index.ts')
                : path.resolve(fullDir, 'index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name]/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js(x)?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      utils: path.join(process.cwd(), "./utils")
    }
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   filename: `${entry}/index.html`
    // })
  ]
};

module.exports = webpackConfig;
