/**
 * Entry of the application
 */

// Catch CTRL/CMD+C interrupts cleanly
process.on("SIGINT", () => {
  process.exit(0);
});

/**
 * Entry Script
 */

if (process.env.NODE_ENV === 'production') {
  process.env.webpackAssets = JSON.stringify(require('./dist/client/manifest.json'));
  process.env.webpackChunkAssets = JSON.stringify(require('./dist/client/chunk-manifest.json'));
  // In production, serve the webpacked server file.
  require('./build/server.bundle.js');
} else {
  require('./server/server.tsx');
}
