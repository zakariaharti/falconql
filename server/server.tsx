// Server entrypoint

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

import * as React from "react";
import { Context } from "koa";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import * as Koa from "koa";
import * as koaCors from "@koa/cors";
import * as KoaRouter from "koa-router";
import * as webpack from "webpack";
import * as KoaWebpack from "koa-webpack";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/** LOCAL */

import App from "../client/modules/App/App";
import { createClient } from "../client/graphql";
import { renderer } from "../lib/renderer";

// ----------------------------------------------------------------------------
const isProdMode = process.env.NODE_ENV === 'production' || false;

// Router
const router = new KoaRouter()
  .get("/ping", async ctx => {
    ctx.body = "pong";
  })
  .get("/favicon.ico", async ctx => {
    ctx.status = 204;
  });

// Koa instance
export const app = new Koa()

  // CORS
  .use(koaCors())

  // Error catcher
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      console.log("Error:", e);
      ctx.status = 500;
      ctx.body = "There was an error. Please try again later.";
    }
  });

app.use(router.allowedMethods()).use(router.routes());

// in development mode
if (!isProdMode) {
   const webpack = require('webpack');
   const config = require('../webpack/client.js');
   const compiler = webpack(config);

   app.use(async () => {
     await KoaWebpack({
       compiler,
       devMiddleware: {
         logLevel: "info",
         publicPath: "/",
         stats: false
       }
     });
   });
}

// Types
export interface IRouterContext {
  status?: number;
  url?: string;
}

app.use(async (ctx: Context) => {
  // Create a new Apollo client
  const client = createClient();

  // styled-components ssr support
 const sheet = new ServerStyleSheet();

  // Create a fresh 'context' for React Router
  const routerContext: IRouterContext = {};

  // Render our components - passing down MobX state, a GraphQL client,
  // and a router for rendering based on our route config
  const components = (
      <StyleSheetManager sheet={sheet}>
        <ApolloProvider client={client}>
          <StaticRouter location={ctx.request.url} context={routerContext}>
            <App />
          </StaticRouter>
        </ApolloProvider>
      </StyleSheetManager>
  );

  // Await GraphQL data coming from the API server
  await getDataFromTree(components);

  // Handle 301/302 redirects
  if ([301, 302].includes(routerContext.status!)) {
    // 301 = permanent redirect, 302 = temporary
    ctx.status = routerContext.status!;

    // Issue the new `Location:` header
    ctx.redirect(routerContext.url!);

    // Return early -- no need to set a response body
    return;
  }

  // Handle 404 `Not Found`
  if (routerContext.status === 404) {
    // By default, just set the status code to 404. You can
    // modify this section to do things like log errors to a
    // third-party, or redirect users to a dedicated 404 page

    ctx.status = 404;
    ctx.body = "Not found";

    return;
  }

  // Create response HTML
  const html = ReactDOMServer.renderToString(components);

  // Create the React render, and inject the `<head>` section
  // courtesy of React Helmet.
  const finalView = renderer(html, {}, client.extract(), sheet);

  // Set the return type to `text/html`, and dump the response back to
  // the client
  ctx.type = "text/html";
  ctx.status = 200;
  ctx.body = `${finalView}`;
});
