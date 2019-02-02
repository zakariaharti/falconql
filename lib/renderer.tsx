import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';

const isProdMode = process.env.NODE_ENV === 'production' || false;

/**
 * render full page HTML markup
 *
 * @param {string} html
 * @param {object} initialState
 */
export const renderer = (
  html: string,
  ReduxState: any,
  apolloState: any,
  sheet: ServerStyleSheet
) => {
  const helmet = Helmet.renderStatic();

  // Import Manifests
  const assetsManifest = process.env.webpackAssets && JSON.parse(process.env.webpackAssets);
  const chunkManifest = process.env.webpackChunkAssets && JSON.parse(process.env.webpackChunkAssets);
  const assetsFilename = typeof assetsManifest !== 'undefined'
     ? assetsManifest['/assets/css/styles.css']
     : '/assets/css/styles.css';
  const cssFileName = isProdMode ? 'assets/css/styles.css' : assetsFilename;

  const htmlMarkup = `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
      <head>
         ${helmet.base.toString()}
         ${helmet.meta.toString()}
         ${helmet.title.toString()}
         ${helmet.link.toString()}
         ${helmet.script.toString()}
         ${sheet.getStyleTags()}
         <link rel="stylesheet" href="${cssFileName}"></link>
      </head>
      <body ${helmet.bodyAttributes.toString()}>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(ReduxState)};
          window.__APOLLO_STATE__ = ${JSON.stringify(apolloState)};
          ${isProdMode ?
          `//<![CDATA[
            window.webpackManifest = ${JSON.stringify(chunkManifest)};
          //]]>` : ''}
        </script>
        <script src='${isProdMode ? assetsManifest['/main.bundle.js'] : '/main.bundle.js'}'></script>
      </body>
    </html>
  `;

  return htmlMarkup;
}
