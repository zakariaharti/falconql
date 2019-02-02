// WEBPACK (server)
// --------------------------------------------------------
// IMPORTS

/* NODE */
const path = require('path');

/* NPM */
const webpack = require('webpack');
const nodeModules = require("webpack-node-externals");
const merge = require('webpack-merge');

/* LOCAL */
const common = require('./common');
const css =  require('./css');

const isProdMode = process.env.NODE_ENV === 'production';

// server webpack config
const server: webpack.Configuration = {
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
  },
  name: "server",
  output: {
    filename: "../server.js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "..", "..", "dist", "public"),
    publicPath: "/"
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.BannerPlugin({
      banner: `require("source-map-support").install();`,
      entryOnly: false,
      include: ["server.js"],
      raw: true
    }),
    new webpack.DefinePlugin({
      GRAPHQL: JSON.stringify(process.env.GRAPHQL),
      SERVER: true,
    })
  ],
  resolve: {
    modules: [path.resolve(__dirname, "..", "..", "node_modules")]
  },
  target: "node"
};

/** merge client with common */
const mergedServer = merge(common,server);

/** dev config */
if(process.env.NODE_ENV === 'development'){
  mergedServer.devtool = 'inline-source-map';
}

/** prod config */
if(process.env.NODE_ENV === 'production'){
  mergedServer.devtool = 'source-map';
}

// EXPORTS
export default mergedServer;
