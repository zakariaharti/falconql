// Runner (production)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import * as fs from "fs";

/* NPM */
import * as chalk from "chalk";

/* Local */
import Output from "../lib/output";
import Stats, { IStats } from "../lib/stats";
import { app, buildInfo, runner } from "./runner";

// ----------------------------------------------------------------------------

function getStats(file: string): IStats {
  return JSON.parse(fs.readFileSync(file, "utf8")) as IStats;
}

buildInfo.spinner.info(chalk.default.green("Production mode"));

void (async () => {
  // Get a list of file accessibility
  const files = Object.values(buildInfo.stats).map(file => {
    try {
      fs.accessSync(file);
      return true;
    } catch (_e) {
      return false;
    }
  });

  // Compile the server if we don't have all the expected files
  if (!files.every(file => file)) {
    buildInfo.spinner.info("Building production server...");
    await runner().build(false);
  } else {
    buildInfo.spinner.info("Using cached build files");
  }

  // Create an Output
  const output = new Output({
    client: new Stats(getStats(buildInfo.stats.clientStats)),
    server: new Stats(getStats(buildInfo.stats.serverStats))
  });

  // Attach middleware
  app.use(require(buildInfo.stats.server).default(output));

  app.listen(buildInfo.port, () => {
    buildInfo.spinner.succeed(`Running on http://localhost:${buildInfo.port}`);
  });
})();
