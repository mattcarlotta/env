import { expectType } from "tsd";
import env from "@noshot/env";
import type { ConfigOptions, ParsedEnvs, ProcessEnv } from "@noshot/env";

// CONFIG
const result = env.config();
expectType<string>(result.parsed["ROOT"]);

const { parsed, extracted } = env.config({
  dir: "tests",
  paths: ".env-example",
  encoding: "utf8",
  debug: true
});

expectType<ProcessEnv>(parsed);
expectType<string>(parsed["BASE"]);
expectType<ParsedEnvs>(extracted);
expectType<string>(extracted["BASE"]);

// DECRYPT
const { decryptedEnvs, decryptedResult} = env.decrypt({
  algorithm: "aes-256-cbc",
  envs: "d4b6baef6ae9313a17b3f736a4e28ba35f4f23a74397a06f75fefe7acc777b81570a12ccee82ff4e2c05f148dce3b17c", encoding: "utf8",
  input: "hex",
  iv: "507e1b56bd09de07",
  secret: "abcdefghijklmnopqrstuv1234567890"
});

expectType<string>(decryptedEnvs);
expectType<any>(decryptedResult);

// ENCRYPT
const envString = JSON.stringify({
  ABC: "123",
  DEF: "678",
  HIJ: "$ABC$DEF",
});

const { encryptedEvs, iv} = env.encrypt({
  algorithm: "aes-256-cbc",
  envs: envString,
  encoding: "utf8",
  input: "hex",
  secret: "abcdefghijklmnopqrstuv1234567890"
});

expectType<string>(encryptedEvs);
expectType<string>(iv);


// LOAD
expectType<ConfigOptions>(env.load("test"));
const envConfig = env.load("test");
expectType<ConfigOptions>(envConfig);
expectType<string>(envConfig["dir"] as string);

// PARSE
expectType<ParsedEnvs>(env.parse("NODE_ENV=production\nDB_HOST=a.b.c"));

const parsedEnvs = env.parse(Buffer.from("JUSTICE=league\n"));
expectType<ParsedEnvs>(parsedEnvs);
expectType<ProcessEnv>(env.assign(parsedEnvs))
