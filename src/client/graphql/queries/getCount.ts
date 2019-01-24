// get number of countes query

// ----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import gql from 'graphql-tag';

// ----------------------------------------------------------------------------

// GraphQL query for retrieving the current count from local state
const countQuery = gql`
  query Count{
    state @client{
      count
    }
  }
`;

// EXPORTS
export default countQuery;
