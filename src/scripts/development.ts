// Runner (development)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as chalk from "chalk";
import * as KoaWebpack from "koa-webpack";

/* Local */
import { buildInfo, app, runner } from "./runner";

// ----------------------------------------------------------------------------

buildInfo.spinner
  .info(chalk.default.magenta("Development mode"))
  .info("Building development server...");

app.listen({ port: buildInfo.port, host: 'localhost'}, async () => {
  const koaWebpackMiddleware = await KoaWebpack({
    compiler: runner().compiler as any,
    devMiddleware: {
      logLevel: "info",
      publicPath: "/",
      stats: false
    }
  });

  app.use(koaWebpackMiddleware);

  (runner().compiler as any).hooks.done.tap("built", () => {
    buildInfo.spinner.succeed(`Running on http://localhost:${buildInfo.port}`);
  });
});
