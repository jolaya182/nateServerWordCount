/**
 * Webpack config file.
 */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const APP_DIR = path.resolve(__dirname, './../src/index.jsx');

module.exports = (env) =>
  merge([
    {
      entry: ['@babel/polyfill', APP_DIR],
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          },
          {
            test: /\.s?css$/,
            use: [
              {
                loader:
                  env.PLATFORM === 'production'
                    ? MiniCssExtractPlugin.loader
                    : 'style-loader'
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'sass-loader'
              }
            ]
          },
          {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            exclude: /node_modules/,
            loader: 'url-loader',
            options: {
              // publicPath: './fonts/'
              // name: '../src/webFonts/[name].[ext]'
              // limit: 1000
            }
          },
          {
            test: /\.(png|svg|jpg|gif|)$/,
            // type:'asset/resource',
            // options:{
            //   publicPath:'./dist',
            //   name:'../src/server/images/[name].[ext]'
            // },
            use: ['file-loader']
          }
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './src/mainIndex.html',
          filename: './index.html',
          favicon: './src/backEnd/pictures/jLogo.ico'
        }),
        new webpack.DefinePlugin({
          'process.env.VERSION': JSON.stringify(env.VERSION),
          'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
        }),
        new webpack.HotModuleReplacementPlugin()
      ],
      devtool: 'source-map'
    }
  ]);
