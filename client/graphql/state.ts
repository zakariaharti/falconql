// application state
// ----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';

/** LOCAL */
import resolvers from './resolvers';

// ----------------------------------------------------------------------------

/**
 * create and return the apollo state link 
 *
 * @param {InMemoryCache} cache
 */
const createState = (cache: InMemoryCache) => {
  return withClientState({
    cache,
    ...resolvers
  });
};

export default createState;
