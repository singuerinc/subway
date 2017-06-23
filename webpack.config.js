const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new webpack.HotModuleReplacementPlugin() // Enable HMR
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devtool: "cheap-eval-source-map",
    devServer: {
        hot: true, // Tell the dev-server we're using HMR
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    }
};
