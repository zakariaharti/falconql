const webpack = require('webpack');
const path = require('path');

const config = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$i/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
          }
        ]
      },
      {
        test: /\.(tsx|ts|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                "@babel/preset-react",
              ],
              plugins: [
                [
                  '@babel/plugin-syntax-decorators',
                  {
                    decoratorsBeforeExport: true
                  }
                ],
                '@babel/plugin-syntax-jsx',
                'react-hot-loader/babel',
                [
                  'babel-plugin-styled-components',
                  {
                    displayName: process.env.NODE_ENV !== 'procuction'
                  }
                ]
              ]
            }
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      }
    ]
  },
  output: {
    publicPath: '/'
  },
  resolve: {
     extensions: [".mjs", ".ts", ".tsx", ".jsx", ".js", ".json"],
   },
};

module.exports = config;
