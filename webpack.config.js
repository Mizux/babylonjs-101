'use strict';
const path = require('path');
// creates index.html file.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    contentBase: ['.'],
    inline: true,
    hot: true,
    historyApiFallback: true,
    noInfo: true
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    //publicPath: '/dist/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  performance: {
    hints: false
  }
};
