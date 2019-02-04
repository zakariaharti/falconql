const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeModules = require('webpack-node-externals');

const common = require('./webpack.common');

const config = merge(common,{
  mode: 'production',
  devtool: "source-map",
  entry: [
    path.resolve(__dirname,'server','server.tsx')
  ],
  output: {
    filename: "server.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "build", "public"),
    publicPath: "/",
  },
  externals: nodeModules(),
  module: {
    rules: [
      {
        test: /\.css$i/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
              minimize: false,
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
        ]
      },
      {
        test: /\.scss|sass$i/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
              minimize: false,
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.less$i/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
              minimize: false,
              sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            }
          },
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
         {
           loader: "file-loader",
           options: {
             name: `assets/img/[name].[hash].[ext]`,
           },
         },
       ],
     },
     {
       test: /\.(woff|woff2|(o|t)tf|eot)$/i,
       use: [
          {
            loader: "file-loader",
            query: {
              name: `assets/fonts/[name].[hash].[ext]`,
            },
          },
        ],
     }
    ]
  },
  target: "node",
  node: {
    __filename: true,
    __dirname: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: "assets/css/[id].css",
      filename: "assets/css/[name].css",
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.DefinePlugin({
      'SERVER': JSON.stringify(true)
    }),
  ]
});

module.exports = config;
