import { expectType } from "tsd";
import env from "@noshot/env";
import type { ConfigOptions, ParsedEnvs, ProcessEnv } from "@noshot/env";

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

expectType<ConfigOptions>(env.load("test"));
const envConfig = env.load("test");
expectType<ConfigOptions>(envConfig);
expectType<string>(envConfig["dir"] as string);

expectType<ParsedEnvs>(env.parse("NODE_ENV=production\nDB_HOST=a.b.c"));

const parsedEnvs = env.parse(Buffer.from("JUSTICE=league\n"));
expectType<ParsedEnvs>(parsedEnvs);
expectType<ProcessEnv>(env.assign(parsedEnvs))
