'use strict';
const path = require('path');

module.exports = {
  mode: 'development',
	devtool: 'inline-source-map',
  devServer: {
    port: 8080,
    contentBase: ['.'],
    inline: true,
    hot: true,
    historyApiFallback: true,
    noInfo: true
  },
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
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
