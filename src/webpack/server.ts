// WEBPACK (client)
// --------------------------------------------------------
// IMPORTS

/* NODE */
import * as path from 'path';

/* NPM */
import {Configuration} from 'webpack';
import * as nodeModules from "webpack-node-externals";
import * as merge from 'webpack-merge';

/* LOCAL */
import common from './common';

const isProdMode = process.env.NODE_ENV === 'production';

// server webpack config
const server: Configuration = {

}
