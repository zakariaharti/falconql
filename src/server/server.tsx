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
