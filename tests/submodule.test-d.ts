import { expectType } from "tsd";
import assign, { assignEnvs } from "@noshot/env/assign";
import config, { config as setConfig } from "@noshot/env/config";
import decrypt, { decrypt as decryptConfig } from "@noshot/env/decrypt";
import encrypt, { encrypt as encryptConfig } from "@noshot/env/encrypt";
import load, { load as loadConfig } from "@noshot/env/load";
import parse, { parse as parseConfig } from "@noshot/env/parse";
import type { ConfigOptions, ParsedEnvs, ProcessEnv } from "@noshot/env";

// CONFIG DEFAULT IMPORT
const result = config();
expectType<string>(result.parsed["ROOT"]);

const { parsed, extracted } = config({
  dir: "tests",
  paths: ".env-example",
  encoding: "utf8",
  debug: true
});

expectType<ProcessEnv>(parsed);
expectType<string>(parsed["BASE"]);
expectType<ParsedEnvs>(extracted);
expectType<string>(extracted["BASE"]);

// CONFIG NAMED IMPORT
const { parsed: parsed2, extracted: extracted2 } = setConfig({
  dir: "tests",
  paths: ".env-example",
  encoding: "utf8",
  debug: true
});

expectType<ProcessEnv>(parsed2);
expectType<string>(parsed2["BASE"]);
expectType<ParsedEnvs>(extracted2);
expectType<string>(extracted2["BASE"]);

// DECRYPT DEFAULT IMPORT
const { decryptedEnvs, decryptedResult} = decrypt({
  algorithm: "aes-256-cbc",
  envs: "d4b6baef6ae9313a17b3f736a4e28ba35f4f23a74397a06f75fefe7acc777b81570a12ccee82ff4e2c05f148dce3b17c", encoding: "utf8",
  input: "hex",
  iv: "507e1b56bd09de07",
  secret: "abcdefghijklmnopqrstuv1234567890"
});

expectType<string>(decryptedEnvs);
expectType<any>(decryptedResult);

// DECRYPT NAMED IMPORT
const { decryptedEnvs: decryptedEnvs2, decryptedResult: decryptedResult2} = decryptConfig({
  algorithm: "aes-256-cbc",
  envs: "d4b6baef6ae9313a17b3f736a4e28ba35f4f23a74397a06f75fefe7acc777b81570a12ccee82ff4e2c05f148dce3b17c", encoding: "utf8",
  input: "hex",
  iv: "507e1b56bd09de07",
  secret: "abcdefghijklmnopqrstuv1234567890"
});

expectType<string>(decryptedEnvs2);
expectType<any>(decryptedResult2);

// ENCRYPT DEFAULT IMPORT
const envString = JSON.stringify({
  ABC: "123",
  DEF: "678",
  HIJ: "$ABC$DEF",
});

const { encryptedEvs, iv} = encrypt({
  algorithm: "aes-256-cbc",
  envs: envString,
  encoding: "utf8",
  input: "hex",
  secret: "abcdefghijklmnopqrstuv1234567890"
});

expectType<string>(encryptedEvs);
expectType<string>(iv);

// ENCRYPT NAMED IMPORT
const { encryptedEvs: encryptedEvs2, iv: iv2} = encryptConfig({
  algorithm: "aes-256-cbc",
  envs: envString,
  encoding: "utf8",
  input: "hex",
  secret: "abcdefghijklmnopqrstuv1234567890"
});

expectType<string>(encryptedEvs2);
expectType<string>(iv2);


// LOAD DEFAULT IMPORT
expectType<ConfigOptions>(load("test"));
const envConfig = load("test");
expectType<ConfigOptions>(envConfig);
expectType<string>(envConfig["dir"] as string);

// LOAD NAMED IMPORT
expectType<ConfigOptions>(loadConfig("test"));
const envConfig2 = loadConfig("test");
expectType<ConfigOptions>(envConfig2);
expectType<string>(envConfig2["dir"] as string);

// PARSE DEFAULT IMPORT
expectType<ParsedEnvs>(parse("NODE_ENV=production\nDB_HOST=a.b.c"));

const parsedEnvs = parse(Buffer.from("JUSTICE=league\n"));
expectType<ParsedEnvs>(parsedEnvs);
expectType<ProcessEnv>(assign(parsedEnvs))
expectType<ProcessEnv>(assignEnvs(parsedEnvs))

// PARSE NAMED IMPORT
expectType<ParsedEnvs>(parseConfig("NODE_ENV=production\nDB_HOST=a.b.c"));

const parsedEnvs2 = parseConfig(Buffer.from("JUSTICE=league\n"));
expectType<ParsedEnvs>(parsedEnvs2);

// ASSIGN DEFAULT IMPORT
expectType<ProcessEnv>(assign(parsedEnvs2))
// ASSIGN NAMED IMPORT
expectType<ProcessEnv>(assignEnvs(parsedEnvs2))
