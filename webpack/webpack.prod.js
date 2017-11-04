const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, '../');
const outputPath = path.resolve(__dirname, '../dist');

module.exports = {
  entry: './js/index.js',
  output: {
    path: outputPath,
    filename: '[hash].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin([outputPath], {
      root: rootPath,
    }),
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      filename: '../index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  }
};