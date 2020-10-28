import { config, parse } from "snackables";

process.env.ENV_CACHE = "true";

const { cachedEnvFiles } = config({ path: ".env.base" });

console.log(
  `\x1b[32mprocess.env.BASE should be assigned "hello": ${
    process.env.BASE === "hello"
  }\x1b[0m`
);

delete process.env.BASE;

console.log(
  `\x1b[32mprocess.env.BASE should be undefined: ${
    process.env.BASE === undefined
  }\x1b[0m`
);

parse(cachedEnvFiles);

console.log(
  `\x1b[32mprocess.env.BASE should be restored from cache and be "hello": ${
    process.env.BASE === "hello"
  }\x1b[0m`
);

delete process.env.BASE;

console.log(
  `\x1b[32mprocess.env.BASE should be undefined: ${
    process.env.BASE === undefined
  }\x1b[0m`
);

process.env.LOADED_CACHE = "true";

parse(cachedEnvFiles);

console.log(
  `\x1b[32mprocess.env.BASE should remain undefined: ${
    process.env.BASE === undefined
  }\x1b[0m`
);
