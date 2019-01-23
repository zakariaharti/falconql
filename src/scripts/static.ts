// Runner (static)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as chalk from "chalk";

/* Local */
import { buildInfo, runner } from "./runner";

// ----------------------------------------------------------------------------

buildInfo.spinner.info(chalk.default.bgBlue("Static mode"));

(async () => {
  await runner().build(true);
  buildInfo.spinner.succeed("Finished building");
})();
