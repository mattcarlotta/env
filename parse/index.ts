/*
  BSD 2-Clause "Simplified" License
 
  Copyright (c) 2015, Scott Motte
 
  All rights reserved.
 
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
 
  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
 
  Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
 
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import { readFileSync } from "fs";
import { execSync } from "child_process";
import decrypt from "../decrypt";
import { logWarning } from "../log";
import fileExists from "../fileExists";
import type { DecryptOptions, Option, ParsedEnvs } from "../index";

/**
 * Parses a string or buffer of Envs into an object.
 *
 * @param src - contents to be parsed (string | Buffer)
 * @param override - allows extracted Envs to be parsed regardless if `process.env` has the properties defined (boolean | string)
 * @returns a single object of all { key: value } pairs from `src`
 * @example parse(Buffer.from("JUSTICE=league\n"));
 */
export default function parse(
  src: string | Buffer,
  override?: Option
): ParsedEnvs {
  const { assign } = Object;
  const { env } = process;
  // initialize extracted Envs object
  const extracted: ParsedEnvs = {};

  // interprets lines from command line, process.env or .env
  function interpolate(envValue: string): string {
    // find interpolated values with $(KEY) or with $KEY/${KEY}
    const matches =
      envValue.match(/\$\(([^)]+)\)/g) ||
      envValue.match(/(.?\${?(?:[a-zA-Z0-9_|]+)?}?)/g);

    return !matches
      ? envValue
      : matches.reduce((newEnv: string, match: string): string => {
          // matches lines against $(command) or $command/${command}
          const parts =
            /(.?)\$\(([^)]+)\)/g.exec(match) ||
            /(.?)\${?([a-zA-Z0-9_|]+)?}?/g.exec(match);

          const line = parts![0],
            command = parts![1],
            stripped = parts![2];

          let value = "",
            replacePart = line.substring(command.length);

          if (command === "\\") {
            // removes escaped characters
            replacePart = line;
            value = replacePart.replace("\\$", "$");
          } else if (line[1] === "(" && line[line.length - 1] === ")") {
            // attempts to substitute commands
            try {
              value = execSync(stripped, {
                stdio: "pipe"
              }).toString();
            } catch (err) {
              logWarning(`\x1b[31m${err.message}\x1b[0m`);
            }
          } else {
            // split values for "|": ["key", "default"]
            const defaultValue = stripped.split("|");
            const key = defaultValue[0],
              fallbackValue = defaultValue[1] || "";

            // interpolate value from process or extracted object or fallback value
            value = interpolate(env[key] || extracted[key] || fallbackValue);
          }

          return newEnv.replace(replacePart, value.trim());
        }, envValue);
  }

  // converts Buffers before splitting into lines and processing
  const keyValues = src.toString().split(/\n|\r|\r\n/);

  // loops over key value pairs
  for (let i = 0; i < keyValues.length; i += 1) {
    const VAL = keyValues[i];
    // finds matching "KEY' and 'VAL' in 'KEY=VAL'
    let keyValueArr = VAL.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

    // finds matching '# extends: path/to/.env'
    if (!keyValueArr) {
      keyValueArr = keyValues[i].match(/(?<=# extends: ).*/g);

      // checks if there's a matching extension
      if (Array.isArray(keyValueArr)) {
        let extended = {};
        const [envPath] = keyValueArr;
        // if the file exists, parse it...
        if (fileExists(envPath))
          extended = parse(readFileSync(envPath), override);

        // and assign it to extracted
        assign(extracted, extended);

        // remove extension value
        keyValueArr = null;
      }
    }

    if (!keyValueArr) {
      // finds matching '# uses: remoteurl, algorithm, secret, iv, input, encoding'
      keyValueArr = keyValues[i].match(/(?<=# uses: ).*/g);

      // checks if there's a match
      if (Array.isArray(keyValueArr)) {
        const [envRemotePath] = keyValueArr;

        // splits string by space
        const [remoteurl, algorithm, secret, iv, input, encoding] =
          envRemotePath.split(" ");

        // fetch encrypted string from remoteurl
        const envs = interpolate(`$(curl ${remoteurl})`);

        if (envs && typeof envs === "string") {
          const { decryptedEnvs } = decrypt({
            algorithm,
            encoding,
            envs,
            input,
            iv,
            secret
          } as DecryptOptions);

          // and assign it to extracted
          assign(extracted, parse(decryptedEnvs));
        }

        // remove extension value
        keyValueArr = null;
      }
    }

    if (keyValueArr) {
      const key = keyValueArr[1];

      // prevents the extracted value from overriding a process.env variable
      if (override || !env[key]) {
        let value = keyValueArr[2] || "";
        const end = value.length - 1;
        const isDoubleQuoted = value[0] === '"' && value[end] === '"';
        const isSingleQuoted = value[0] === "'" && value[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          value = value.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) value = value.replace(/\\n/g, "\n");
        } else {
          value = interpolate(value);
        }

        // set value to extracted object
        extracted[key] = value;
      }
    }
  }

  return extracted;
}
