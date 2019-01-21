// WEBPACK (client)
// --------------------------------------------------------
// IMPORTS

/* NODE */
import * as path from 'path';

/* NPM */
import {Configuration} from 'webpack';
import * as nodeModules from "webpack-node-externals";
import * as merge from 'webpack-merge';

/* LOCAL */
import common from './common';
import css from "./css";

const isProdMode = process.env.NODE_ENV === 'production';

// server webpack config
const server: Configuration = {
  entry: [
    path.resolve(__dirname,'..','server','server.tsx')
  ],
  externals: nodeModules(),
  module: {
    rules: [
      ...css(false),
      {
        test: /\.(woff|woff2|(o|t)tf|eot)$/,
        use: [
          {
            loader: "file-loader",
            query: {
              name: `assets/img/[name]${isProdMode ? ".[hash]" : ""}.[ext]`
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            query: {
              name: `assets/fonts/[name]${isProdMode ? ".[hash]" : ""}.[ext]`
            }
          }
        ]
      }
    ]
  }
}
