// WEBPACK (static)
// -------------------------------------------------------

// IMPORTS

/** NPM */
import * as HtmlWebpackPlugin from "html-webpack-plugin";

/** LOCAL */
import client from './client';

// -------------------------------------------------------

client.plugins.push(
  new HtmlWebpackPlugin({
    inject: false,
    template: "src/views/static.html",
    title: "FalconQl app"
  })
);

export default client;
