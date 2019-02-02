// Application routes

// -----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import { RouteConfig } from 'react-router-config';

/** LOCAL */
import App from './modules/App/App';

// -----------------------------------------------------------------------------

export const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: App
  }
];
