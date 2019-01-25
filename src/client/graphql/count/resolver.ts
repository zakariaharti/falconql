// count resolver
// ----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import { InMemoryCache } from "apollo-cache-inmemory";

/** LOCAL */
import getCountQuery from './queries/getCount';
import { IRoot } from '../../types/state';

// ----------------------------------------------------------------------------

/**
 * count resolver type
 */
interface ICountResolver {
  Mutaion: {
    incrementCount: (obj?: any, vars?: any, ctx?: { cache: InMemoryCache}, info?: any) => any;
  }
}

/**
 * count feature resolver
 */
const countResolver: ICountResolver = {
  Mutaion: {
    incrementCount(_obj,_vars,{ cache },_){
      const previousState = cache.readQuery<IRoot>({ query: getCountQuery }).state;
      const newState = {
        ...previousState,
        count: previousState.count++
      };
      cache.writeData<IRoot>({ data: { state: newState }});

      return newState;
    }
  }
};

export default countResolver;
