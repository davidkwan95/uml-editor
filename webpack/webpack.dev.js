var SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './js/index.js',
  output: {
    publicPath: '/',
    filename: '[hash].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      filename: 'index.html',
    }),
    new SourceMapDevToolPlugin(),
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