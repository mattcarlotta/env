import type { CipherKey, Encoding } from "crypto";
import assign from "./assign";
import config from "./config";
import encrypt from "./encrypt";
import decrypt from "./decrypt";
import parse from "./parse";
import load from "./load";

export type { CipherKey, Encoding };

export interface CryptOptions {
  algorithm: string;
  envs: string | Buffer;
  encoding: Encoding;
  input: Encoding;
  secret: CipherKey;
}

export type EncryptResult = {
  encryptedEvs: string;
  iv: string;
};

export type DecryptResult = {
  decryptedEnvs: string;
  decryptedResult: any;
};

export interface DecryptOptions extends CryptOptions {
  envs: string;
  iv: string;
}

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

export { assign, config, decrypt, encrypt, load, parse };

const env = {
  assign,
  config,
  decrypt,
  encrypt,
  load,
  parse
};

export default env;
