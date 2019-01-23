// Runner (production)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as chalk from "chalk";

/* Local */
import { runner, buildInfo } from "./runner";

// ----------------------------------------------------------------------------

buildInfo.spinner.info(chalk.default.bgBlue("Build mode"));

void (async () => {
  await runner().build(false);
  buildInfo.spinner.succeed("Finished building");
})();
