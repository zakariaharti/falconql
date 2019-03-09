# FalconQl

Universal full-stack Node.js + React + GraphQL starter kit, written in Typescript.

## Features

### Front-end stack

- [React v16](https://facebook.github.io/react/) for UI.
- [Apollo Client 2.0 (React)](http://dev.apollodata.com/react/) for connecting to GraphQL.
- [MobX](https://mobx.js.org/) for declarative, type-safe flux/store state management (automatically re-hydrated from the server.) which is auto-saved and reloaded to `localStorage` in the client (simple to disable if you don't need it.)
- [Emotion](https://emotion.sh/) CSS-in-JS, with inline `<style>` tag generation that contains only the CSS that needs to be rendered.
- [Sass](https://sass-lang.com/), [Less](http://lesscss.org/) and [PostCSS](https://postcss.org/) when importing `.css/.scss/.less` files.
- [React Router 4](https://reacttraining.com/react-router/) for declarative browser + server routes.
- [GraphQL Code Generator](https://graphql-code-generator.com/) for parsing remote GraphQL server schemas, for automatically building fully-typed Apollo React HOCs instead of writing `<Query>` / `<Mutation>` queries manually 
- Declarative/dynamic `<head>` section, using [react-helmet](https://github.com/nfl/react-helmet).

### Server-side rendering

- Built-in [Koa 2](http://koajs.com/) web server, with async/await routing.
- Full route-aware server-side rendering (SSR) of initial HTML.
- Universal building - both browser + Node.js web server compile down to static files, for fast server re-spawning.
- Per-request GraphQL store. Store state is dehydrated via SSR, and rehydrated automatically on the client.
- MobX for app-wide flux/store state, with a built-in `<StateConsumer>` for automatically re-rendering any React component that 'listens' to state and full client-side rehydration. Fully typed state!
- Full page React via built-in SSR component - every byte of your HTML is React.
- SSR in both development and production, even with hot-code reload.

### Real-time

- Hot code reloading; zero refresh, real-time updates in development.
- Development web server that automatically sends patches on code changes, and restarts the built-in Web server for SSR renders that reflect what you'd see in production.
- WebSocket `subscription` query support for real-time data (just set `WS_SUBSCRIPTIONS=1` in [.env](.env))

### Code optimisation

- [Webpack v4](https://webpack.js.org/), with [tree shaking](https://webpack.js.org/guides/tree-shaking/) -- dead code paths are automatically eliminated.
- Asynchronous code loading when `import()`'ing inside a function.
- Automatic per-vendor chunk splitting/hashing, for aggressive caching (especially good behind a HTTP/2 proxy!)
- Gzip/Brotli minification of static assets.
- CSS code is combined, minified and optimised automatically - even if you use SASS, LESS and CSS together!

### Styles

- [Emotion](https://emotion.sh/), for writing CSS styles inline and generating the minimal CSS required to properly render your components.
- [PostCSS v7](http://postcss.org/) with [next-gen CSS](https://preset-env.cssdb.org/) and automatic vendor prefixing when importing `.css`, `.scss` or `.less` files.
- [SASS](http://sass-lang.com) and [LESS](http://lesscss.org/) support (also parsed through PostCSS.)
- Automatic vendor prefixing - write modern CSS, and let the compiler take care of browser compatibility.
- Mix and match SASS, LESS and regular CSS - without conflicts!
- CSS modules - your classes are hashed automatically, to avoid namespace conflicts.
- Compatible with Foundation, Bootstrap, Material UI and more. Simply configure via a `.global.(css|scss|less)` import to preserve class names.

### Production-ready

- Production bundling via `npm run production`, that generates optimised server and client code.
- [Static compression](https://webpack.js.org/plugins/compression-webpack-plugin/) using the Gzip and [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) algorithms for the serving of static assets as pre-compressed `.gz` and `.br` files (your entire app's `main.js.bz` - including all dependencies - goes from 346kb -> 89kb!)
- Static bundling via `npm run build:static`. Don't need server-side rendering? No problem. Easily deploy a client-only SPA to any static web host (Netlify, etc.)

### Developer support

- Written in [Typescript](https://www.typescriptlang.org/) with full type support, out the box (all external `@types/*` packages installed)
- Heavily documented code

## Quick start

Grab and unpack the latest version, install all dependencies, and start a server:

```
git clone https://github.com/zakariaharti/falconql.git
cd faclconql
yarn install
yarn start
```

Your development server is now running on [http://localhost:3000](http://localhost:3000)

## Development mode

Development mode offers a few useful features:

- Hot code reloading. Make a change anywhere in your code base (outside of the Webpack config), and changes will be pushed down the browser automatically - without page reloads. This happens for React, Emotion, SASS - pretty much anything.

- Full source maps for Javascript and CSS.

- Full server-side rendering, with automatic Koa web server restarting on code changes. This ensures the initial HTML render will always reflect your latest code changes.

To get started, simply run:

```
yarn start
```

A server will be started on [http://localhost:3000](http://localhost:3000)

## Production mode

In production mode, the following happens:

- All assets are optimised and minified. Javascript, CSS, images, are all compiled down to static files that will appear in `dist`.

- Assets are also compressed into `.gz` (Gzip) and `.br` (Brotli) versions, which are served automatically to all capable browsers.

- If files have been generated in a previous run, they will be re-used on subsequent runs. This ensures really fast server start-up times after the initial build.

To build and run for production, use:

```
yarn run production
```

Files will be generated in `./dist`, and a server will also be spawned at [http://localhost:3000](http://localhost:3000)

Clean the cached production build with `npm run clean`, or run `npm run clean-production` to both clean and re-run the production build, as needed.

# Build mode

If you only want to build assets and not actually run the server, use:

```
yarn run build:production
```

## NPM commands

Here's a list of all the NPM script commands available out-the-box:

| Command                    | What it does                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run build:production` | Builds production-ready client/server bundles, but _doesn't_ start a server.                                                                                 |
| `npm run build:static`     | Builds production-ready client bundle and `index.html`; ignores server bundling.                                                                             |
| `npm run clean`            | Removes the `dist` folder, and any previously built client/server bundle.                                                                                    |
| `npm run dev`              | Runs a univeral dev server in memory; auto restarts on code changes _and_ uses hot-code reload in the browser. Does _not_ output anything to `dist`.         |
| `npm run dev:static`       | Runs a client-only dev server using [src/views/static.html] as the template; full hot-code reload. Also doesn't output anything to `dist`.                   |
| `npm run production`       | Builds _and_ runs a production-ready client/server bundle. If previously built, will re-use cached files automatically (run `npm run clean` to clear cache.) |
| `npm run production:clean` | Same as above, but cleans `dist` first to ensure a fresh re-build.                                                                                           |
| `npm start`                | Shortcut for `npm run dev`.                                                                                                                                  |
