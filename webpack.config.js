const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/build',
    library: 'TankGame',
  },
  module: {
    rules: [{ test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'app') },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] }
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
    },
    extensions: ['.js']
  },
  devServer: {
    contentBase: "./", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/index.tpl.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]

}