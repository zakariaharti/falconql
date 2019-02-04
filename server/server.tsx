// Server entrypoint

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

import * as express from 'express';
import * as morgan from 'morgan';
import * as cors  from "cors";
import * as helmet from 'helmet';
import * as lusca from 'lusca';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import * as chalk from 'chalk';
import * as errorHandler from 'errorhandler';

// React and Apollo GraphQL and Styled-Components support
import * as React from 'react';
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/** LOCAL */
import App from "../client/modules/App/App";
import { createClient } from "../client/graphql";
import { renderer } from "../lib/renderer";

// ----------------------------------------------------------------------------

/**
 * loading environment variables where api keys and other options is configured
 */
 dotenv.load();

 /**
  * create express server instance
  */
const app = express();

// Set Development modes checks
const isDevMode = process.env.NODE_ENV === 'development' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;

// Run Webpack dev server in development mode
if (isDevMode) {
  // Webpack Requirements
  const webpack = require('webpack');
  const config = require('../webpack/client.dev.js');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
  app.use(webpackHotMiddleware(compiler));
}

/**
  * express configuration
  */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'secret',
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
}));
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(helmet());
app.use(cors());
app.use(cookieParser());

/**
 * Example routes
 */
app.use('/ping', (_req, res) => {
  res.end('pong');
});

/**
 * server side rendering of React & Redux
 */
app.use(async (req, res, next) => {
  try {
    // Create a new Apollo client
    const client = createClient();

    // styled-components ssr support
   const sheet = new ServerStyleSheet();

    // Create a fresh 'context' for React Router
    const routerContext: any = {};

    // Render our components - passing down MobX state, a GraphQL client,
    // and a router for rendering based on our route config
    const components = (
        <StyleSheetManager sheet={sheet}>
          <ApolloProvider client={client}>
            <StaticRouter location={req.path} context={routerContext}>
              <App />
            </StaticRouter>
          </ApolloProvider>
        </StyleSheetManager>
    );

    // Await GraphQL data coming from the API server
    await getDataFromTree(components);

    // if a <Redirect /> is encoutered
       if(routerContext.url){
         res.redirect(routerContext.url);
       }

       // if notFound encoutered
       if(routerContext.notFound){
         res.status(404);
       }

    // Create response HTML
    const html = renderToString(components);

    // Create the React render, and inject the `<head>` section
    // courtesy of React Helmet.
    const finalView = renderer(html, {}, client.extract(), sheet);

    // Set the return type to `text/html`, and dump the response back to
    // the client
    // else send back the response
      res
       .set('Content-Type','text/html')
       .status(200)
       .end(finalView);
  }catch (e){
    next(e);
  }
});

/**
 * Error Handler.
 */
if (!isProdMode) {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((
    err: express.Errback,
    // @ts-ignore
    _req: express.Request,
    res: express.Response,
    // @ts-ignore
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  // @ts-ignore
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('Press CTRL-C to stop\n');
});

module.exports = app;
