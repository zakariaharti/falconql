// Webpack (static bundling)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as webpack from "webpack";
// import {} from "webpack-dev-server";

// Plugin for generating `index.html` file for static hosting
import * as HtmlWebpackPlugin from "html-webpack-plugin";

/* Local */

// Common config
import * as merge from "webpack-merge";

// Get the client-side config as a base to extend
import client from "./client";

// ----------------------------------------------------------------------------

// Augment client-side config with HtmlWebPackPlugin
const base: webpack.Configuration = {
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: "src/views/static.html",
      title: "FalconQL app"
    })
  ]
};

export default merge(client, base);
