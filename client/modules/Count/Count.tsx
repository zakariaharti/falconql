// Exapmle Count feature

// -----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import * as React from 'react';
import { Query, Mutation } from 'react-apollo';

/** LOCAL */
import COUNT_QUERY from '../../graphql/count/queries/getCount';
import INCREMENT_MUTAION from '../../graphql/count/mutations/incrementCount';
import { IRoot, IIncrementCount } from '../../types/state';

// -----------------------------------------------------------------------------

class CountQuery extends Query<IRoot, {}>{};
class CountMutation extends Mutation<IIncrementCount, {}> {}

const Count: React.SFC<{}> = () => {
  return (
    <React.Fragment>
    <CountQuery query={COUNT_QUERY}>
      {({data: {state: {count}}}) => (
        <div>current count is : {count}</div>
      )}
    </CountQuery>

    <CountMutation mutation={INCREMENT_MUTAION}>
      {incrementCount => (
        <button onClick={() => incrementCount()}>inrement</button>
      )}
    </CountMutation>
   </React.Fragment>
  )
};

export default Count;
