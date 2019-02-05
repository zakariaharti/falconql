// Apollo GraphQL client setup
// ----------------------------------------------------------------------------
// IMPOTRS

/** NPM */
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import * as ws from 'ws';

/** LOCAL */
import createState from './state';

// ----------------------------------------------------------------------------

export const createClient = (): ApolloClient<NormalizedCacheObject> => {
  /**
   * create Apollo main cache mechanism
   *
   * this is an in-memory cache used by apollo
   * to store local and remote data
   */
  const cache = new InMemoryCache();

  /**
   * apollo recomended http link
   */
  const httpLink = new HttpLink({
     credentials: "same-origin",
     uri: process.env.GRAPHQL
  });

  /**
   * create a WebSockets link
   */
  const wsLink = new WebSocketLink(
    new SubscriptionClient(process.env.GRAPHQL.replace(/^https?/, "ws"), {
      reconnect: true // <-- automatically redirect as needed
    }, ws)
  );

  // if we are in the browser use the __APOLLO_STATE__ global variable
  // it contains the data sent by server to the client se we can restore and use it
  if(!process.env.SERVER){
    // @ts-ignore
    cache.restore(window.__APOLLO_STATE__);
  }

  // Return a new Apollo Client back, with the cache we've just created,
  // and an array of 'links' (Apollo parlance for GraphQL middleware)
  // to tell Apollo how to handle GraphQL requests
  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      // General error handler, to log errors back to the console.
      // Replace this in production with whatever makes sense in your
      // environment. Remember you can use the global `SERVER` variable to
      // determine whether you're running on the server, and record errors
      // out to third-party services, etc
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),

      // Connect local Apollo state. This is our primary mechanism for
      // managing 'flux'/local app data, in lieu of Redux or MobX
      createState(cache),

      // Split on HTTP and WebSockets
      process.env.WS_SUBSCRIPTIONS && !process.env.SERVER
        ? split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
              );
            },
            // Use WebSockets for subscriptions
            wsLink,
            // ... fall-back to HTTP for everything else
            httpLink
          )
        : httpLink // <-- just use HTTP on the server
    ]),
    // On the server, enable SSR mode
    ssrMode: process.env.SERVER ? true : false
  })
};
