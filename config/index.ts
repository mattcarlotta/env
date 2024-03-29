import { readFileSync } from "fs";
import parse from "../parse";
import assign from "../assign";
import getFilePath from "../getFilePath";
import fileExists from "../fileExists";
import { logError, logMessage, logWarning } from "../log";
import type { ConfigOptions, ConfigOutput, ParsedEnvs } from "../index";

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: "value" }
 *
 * @param options - accepts: { `dir`: string, `paths`: string | string[], `encoding`: BufferEncoding, `override`: boolean | string, `debug`: boolean | string }
 * @returns a single object with `parsed` and `extracted` Envs as { KEY: "value" } pairs
 * @example config({ dir: "example", paths: ".env" });
 */
export function config(options?: ConfigOptions): ConfigOutput {
  // default config options
  let dir: ConfigOptions["dir"] = process.cwd();
  let paths: ConfigOptions["paths"] = [".env"];
  let debug: ConfigOptions["debug"];
  let override: ConfigOptions["override"];
  let encoding: ConfigOptions["encoding"] = "utf8";
  let required: ConfigOptions["required"] = [];

  // override default options with config options arguments
  if (options) {
    dir = options.dir || dir;
    paths = options.paths || paths;
    debug = options.debug;
    encoding = options.encoding || encoding;
    override = options.override;
    required = options.required;
  }

  // split paths into array of strings
  const configs = Array.isArray(paths) ? paths : paths.split(",");

  // initializes parsed Env object
  const extracted: ParsedEnvs = {};

  // loop over configs array
  for (let i = 0; i < configs.length; i += 1) {
    // gets config paths file
    const envPath = getFilePath(configs[i], dir);
    try {
      // checks if "envPath" is a file that exists
      if (!fileExists(envPath)) throw String("File doesn't exist");

      // reads and parses Envs from .env file
      const parsed = parse(readFileSync(envPath, { encoding }), override);

      // assigns Envs to an accumulated 'extracted' object
      Object.assign(extracted, parsed);

      if (debug) logMessage(`Loaded env from ${envPath}`);
    } catch (err: any) {
      if (debug) logWarning(`Unable to load ${envPath}: ${err.toString()}.`);
    }
  }

  if (Array.isArray(required) && required.length) {
    const undefinedKeyValues: Array<string> = [];
    for (let i = 0; i < required.length; i += 1) {
      const key = required[i];
      if (extracted[key] == null) undefinedKeyValues.push(key);
    }

    if (undefinedKeyValues.length)
      logError(
        `The following Envs are marked as required: ${undefinedKeyValues
          .map(v => `'${v}'`)
          .join(
            ", "
          )}, but they are undefined after all the specified .env files were parsed.`
      );
  }

  return {
    parsed: assign(extracted),
    extracted
  };
}

export default config;
