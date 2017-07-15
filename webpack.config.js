const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
    new CopyWebpackPlugin([
      { from: './index.html' },
      { from: { glob: './img/**/*' } },
    ]),
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    hot: true, // Tell the dev-server we're using HMR
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
};
