import crypto from "crypto";
import type { CryptOptions, EncryptResult } from "../index";

/**
 * Converts a stringified JSON object into an encrypted single using {@link https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options `crypto.createCipheriv`}.
 *
 * Example: `"{ "KEY": "VALUE" }"` is converted to `"b8cb1867e4a8248c839db9cb0f1e1d"`
 *
 * @param options - accepts an object with the following properties: { `algorithm`: string, `envs`: stringified JSON, `encoding`: BufferEncoding, `input`: Encoding, `secret`: string }
 * @returns an object with the following properties: { `iv`: a random string, `decryptedJSON`: original JSON Object };
 * @example encrypt({ algorithm: "aes-256-cbc", envs: JSON.stringify({ "KEY": "VALUE" }), encoding: "utf8", input: "hex", secret: "abcdefghijklmnopqrstuv1234567890" });
 */
export default function encrypt({
  algorithm,
  envs,
  encoding,
  input,
  secret
}: CryptOptions): EncryptResult {
  const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);

  const encrypter = crypto.createCipheriv(algorithm, secret, iv);

  const encryptedEvs = encrypter
    .update(envs, encoding, input)
    .concat(encrypter.final(input));

  return { encryptedEvs, iv };
}
