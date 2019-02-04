/*
 * webpack common configuration
 */

// ----------------------------------------------------------------
// IMPORTS

/** NODE */
const path = require('path');

// ----------------------------------------------------------------

const root = path.resolve(__dirname, "..");
const configFileName = path.resolve(root,'tsconfig.json');

const isProdMode = process.env.NODE_ENV === 'production';

// common config
const config = {
  mode: isProdMode ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              plugins: [
                "@babel/plugin-syntax-dynamic-import",
                [
                  "@babel/plugin-proposal-decorators",
                  {
                    legacy: true
                  }
                ],
                [
                  "@babel/plugin-proposal-class-properties",
                  {
                    loose: true
                  }
                ],
                "react-hot-loader/babel",
                [
                  "babel-plugin-styled-components",
                  {
                    displayName: !isProdMode
                  }
                ]
              ]
            }
          },
          {
            loader: 'ts-loader',
          }
        ]
      }
    ]
  },
  output: {
      publicPath: "/"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".jsx", ".js", ".json"],
  }
}

// exports
module.exports = config;
