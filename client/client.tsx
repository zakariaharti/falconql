// Client entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

import * as React from "react";
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

/* Local */
import App from './modules/App/App';
import { createClient } from './graphql';

// ----------------------------------------------------------------------------

// Create Apollo client
const client = createClient();

// render components
const root = document.getElementById("root")!;
ReactDOM.hydrate(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  root
);
