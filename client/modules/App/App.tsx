// App Component

// -----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import * as React from 'react';
import Helmet from 'react-helmet';
import { hot }  from 'react-hot-loader';
import { Switch }  from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

/** LOCAL */
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import { routes } from '../../routes';

// -----------------------------------------------------------------------------

// global styles

const App: React.SFC<{}> = () => (
  <div>
    
    <Helmet>
      <title>FalconQl - Starter Project</title>
    </Helmet>
    <Header />
    <Switch>
      {renderRoutes(routes)}
    </Switch>
    <Footer />
  </div>
);

export default hot(module)(App);
