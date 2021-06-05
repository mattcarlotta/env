import config from "./config";
import parse from "./parse";
import load from "./load";
import assign from "./assign";

export interface ParsedEnvs {
  [name: string]: string;
}

export type ProcessEnv = ParsedEnvs;

export type Option = boolean | string | undefined;

export type Path = string | string[];

export interface ConfigOptions {
  dir?: string;
  paths?: Path;
  encoding?: BufferEncoding;
  override?: Option;
  debug?: Option;
}

export interface ConfigOutput {
  parsed: ProcessEnv;
  extracted: ParsedEnvs;
}

/**
 * Immediately loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} when the package is preloaded or imported.
 */
(function (): void {
  const { env } = process;
  const { LOAD_CONFIG } = env;

  // checks if LOAD_CONFIG is defined and assigns config options
  if (LOAD_CONFIG) {
    const envConfig = load(LOAD_CONFIG);

    if (Object.keys(envConfig).length) config(envConfig);

    // prevents the IFFE from reloading the config file
    delete process.env.LOAD_CONFIG;
  }
})();

export { assign, config, load, parse };

const env = {
  assign,
  config,
  load,
  parse
};

export default env;
