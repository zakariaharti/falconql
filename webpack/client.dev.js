const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');

const config = merge(common,{
  mode: 'development',
  devtool: "inline-source-map",
  entry: [
    'webpack-hot-middleware/client',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
     path.resolve('.','client','client.tsx')
  ],
  output: {
    chunkFilename: '[name].bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve('.','build','public')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
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
        test: /\.(scss|sass)$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
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
        test: /\.less$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[local]-[hash:base64]",
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
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
         {
           loader: "file-loader",
           options: {
             name: `assets/img/[name].[ext]`,
           },
         },
       ],
     },
     {
       test: /\.(woff|woff2|(o|t)tf|eot)$/,
       use: [
          {
            loader: "file-loader",
            query: {
              name: `assets/fonts/[name].[ext]`,
            },
          },
        ],
     }
    ]
  },
  node: {
    console: true,
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|s(c|a)ss|less)$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: "assets/css/[id].css",
      filename: "assets/css/app.css",
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
      },
      'CLIENT': JSON.stringify(true)
    }),
  ]
});

module.exports = config;
