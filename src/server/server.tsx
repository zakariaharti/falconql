// Server entrypoint

// ----------------------------------------------------------------------------
// IMPORTS  

/* NPM */

import * as React from "react";
import { Context } from "koa";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import * as ReactDOMServer from "react-dom/server";
import Helmet from "react-helmet";
import { StaticRouter } from "react-router";

/** LOCAL */

import App from "@/client/app/App/App";
import { createClient } from "@/client/graphql";
import Output from "@/lib/output";
import Renderer from "@/lib/renderer";

// ----------------------------------------------------------------------------

// Types
export interface IRouterContext {
  status?: number;
  url?: string;
}

// Everything from this point will be Webpack'd and dumped in `dist/server.js`
// and then loaded into an active Koa server
export default function(output: Output) {
  // Create Koa middleware to handle React requests
  return async (ctx: Context) => {
    // Create a new Apollo client
    const client = createClient();

    // Create a fresh 'context' for React Router
    const routerContext: IRouterContext = {};

    // Render our components - passing down MobX state, a GraphQL client,
    // and a router for rendering based on our route config
    const components = (
        <ApolloProvider client={client}>
          <StaticRouter location={ctx.request.url} context={routerContext}>
            <App />
          </StaticRouter>
        </ApolloProvider>
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
    const reactRender = ReactDOMServer.renderToString(
      <Renderer
        css={output.client.main("css")!}
        helmet={Helmet.renderStatic()}
        html={html}
        scripts={output.client.scripts()}
        window={{
          __APOLLO_STATE__: client.extract(), // <-- GraphQL store
        }}
      />
    );

    // Set the return type to `text/html`, and dump the response back to
    // the client
    ctx.type = "text/html";
    ctx.body = `<!DOCTYPE html>${reactRender}`;
  };
}
