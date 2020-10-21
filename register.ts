import set from "./lib/set";
import extract from "./lib/extract";
import { logInfo } from "./lib/log";
import { Encoding } from "./types";

const { ENV_LOAD, ENV_DEBUG, ENV_ENCODE } = process.env;
/**
 * Loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 *
 */
((): void => {
  // check if ENV_LOAD is defined
  if (ENV_LOAD != null) {
    const debug = Boolean(ENV_DEBUG);

    // extract and split all .env.* from ENV_LOAD into a parsed object of ENVS
    const parsedENVs = extract({
      configs: ENV_LOAD.split(","),
      debug,
      encoding: ENV_ENCODE as Encoding
    });

    // sets ENVS to process.env
    set(parsedENVs);

    /* istanbul ignore else */
    if (debug) logInfo(`Assigned ${JSON.stringify(parsedENVs)} to process.env`);
  }
})();