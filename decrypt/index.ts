import { createDecipheriv } from "crypto";
import type { DecryptOptions, DecryptResult } from "../index";

/**
 * Decrypts and converts a stringified JSON object/Buffer using {@link https://nodejs.org/api/crypto.html#crypto_crypto_createdecipheriv_algorithm_key_iv_options `crypto.createDecipheriv`}.
 *
 * Example: Decrypts `"b8cb1867e4a8248c839db9cb0f1e1d"` to `"KEY=value\nKEY2=value2"`
 *
 * @param options - accepts an object with the following properties: { `algorithm`: string, `envs`: string(encrypted), `encoding`: BufferEncoding, `input`: Encoding, `iv`: string, `secret`: string }
 * @returns an object with the following two properties: `decryptedEnvs`: a single string of "KEY=value" pairs and `decryptedResult`: original JSON object/Buffer string
 * @example decrypt({ algorithm: "aes-256-cbc", envs: "b8cb1867e4a8248c839db9cb0f1e1d", encoding: "utf8", input: "hex", iv: "05c6f2c47de0ecfe", secret: "abcdefghijklmnopqrstuv1234567890" });
 */
export function decrypt({
  algorithm,
  envs,
  encoding,
  input,
  iv,
  secret
}: DecryptOptions): DecryptResult {
  // decrypt string
  const decrypter = createDecipheriv(algorithm, secret, iv);
  const decryptedString = decrypter
    .update(envs, input, encoding)
    .concat(decrypter.final(encoding));

  const isJSON =
    decryptedString[0] === "{" &&
    decryptedString[decryptedString.length - 1] === "}";

  const decryptedResult = isJSON
    ? JSON.parse(decryptedString)
    : Buffer.from(decryptedString);

  const decryptedEnvs = isJSON
    ? decryptedString
        // remove first "{" and last "}"
        .replace(/^\{|\}$/gm, "")
        // replace commas with new lines
        .replace(/,/g, "\n")
        // remove all quotes
        .replace(/["']/g, "")
        // replace first occurence of ":" to "= " for each line
        .replace(/^([^:]*?)\s*:/gm, "$1=")
    : decryptedResult.toString();

  return {
    decryptedEnvs,
    decryptedResult
  };
}

export default decrypt;
