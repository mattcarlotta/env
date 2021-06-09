<div align="center" style="margin: 20px 0;">
  <img src="https://github.com/no-shot/env/blob/main/noshotLogo.png?raw=true" width="450px">
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@noshot/env">
    <img src="https://img.shields.io/npm/v/@noshot/env.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://github.com/no-shot/env/actions?query=workflow%3A%22Publish+Workflow%22">
    <img src="https://img.shields.io/github/workflow/status/no-shot/env/Publish%20Workflow?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://codecov.io/gh/no-shot/env/branch/main">
    <img src="https://img.shields.io/codecov/c/github/no-shot/env?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://github.com/no-shot/env/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@noshot/env.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://www.npmjs.com/package/@noshot/env">
    <img src="https://img.shields.io/npm/dm/@noshot/env?style=for-the-badge&labelColor=000000">
  </a>
</p>

Heavily inspired by [dotenv](https://github.com/motdotla/dotenv) and [dotenv-expand](https://github.com/motdotla/dotenv-expand), `@noshot/env` is a simple to use [zero-dependency](https://bundlephobia.com/result?p=@noshot/env) package module that automatically loads environment variables from a predefined Env variable. When it comes to `.env.*` file naming, `@noshot/env` is unopinionated, so you can name them anything you'd like or you can follow the [The Twelve-Factor App](https://12factor.net/config) methodology.

## Why @noshot/env?

✔️ Loads `.env.*` files between **40%-70%** faster than dotenv and dotenv-expand: [demo](https://github.com/no-shot/env-metrics), [metrics](https://github.com/no-shot/env-metrics#metrics)

✔️ Typescript source with included type declarations

✔️ Zero dependencies

✔️ Compiled and minified ES5 CommonJS

✔️ Experimental [ESM](#how-do-i-use-es-modules) support (beta)

✔️ Unopinionated about `.env.*` naming

✔️ Supports loading multiple `.env.*` files at once

✔️ Supports manually [importing](#config-method) or [parsing](#parse-method) `.env.*` files

✔️ Supports overriding Envs in [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env)

✔️ Supports [extending local .env files](#extending-local-env-files)

✔️ Supports [fetching remote .env files](#fetching-remote-env-files)

✔️ Supports Env [interpolation](#interpolation)

✔️ Supports Env [preloading](#preload)

✔️ Supports loading Envs via an [Env Configuration File](#env-configuration-file)

## Quick Links

[Installation](#installation)

[Usage](#usage)

[Examples](https://github.com/no-shot/env-examples)

[Env Configuration File](#env-configuration-file)

[CLI Options](#cli-options)
  - [LOAD_CONFIG](#load_config)

[Preload](#preload)

[Config Method](#config-method)
  - [Argument Options](#config-argument-options)
    - [dir](#config-dir)
    - [paths](#config-paths)
    - [encoding](#config-encoding)
    - [override](#config-override)
    - [debug](#config-debug)

[Parse Method](#parse-method)
  - [Argument Options](#parse-argument-options)
    - [src](#parse-src)
    - [override](#parse-override)
  - [Rules](#parse-rules)

[Load Method](#load-method)
  - [Argument Options](#load-argument-options)
    - [env](#load-env)
    - [dir](#load-dir)

[Decrypt Method](#decrypt-method)

[Encrypt Method](#encrypt-method)

[Encryption and Decryption Arguments](#encryption-and-decryption-arguments)
  - [algorithm](#encryptdecrypt-algorithm)
  - [envs](#encryptdecrypt-envs)
  - [encoding](#encryptdecrypt-encoding)
  - [input](#encryptdecrypt-input)
  - [iv](#encryptdecrypt-iv)
  - [secret](#encryptdecrypt-secret)
  
[Extending Local .env Files](#extending-local-env-files)

[Fetching Remote .env Files](#fetching-remote-env-files)

[Interpolation](#interpolation)
  - [Interpolation Rules](#interpolation-rules)

[FAQ](#faq)
  - [Should I commit my .env files?](#should-i-commit-my-env-files)
  - [Does this package allow submodule imports?](#does-this-package-allow-submodule-imports)
  - [How does @noshot/env work and will it override already set or predefined variables?](#how-does-noshotenv-work-and-will-it-override-already-set-or-predefined-variables)
  - [Why doesn't the parse method automatically assign Envs?](#why-doesnt-the-parse-method-automatically-assign-envs)
  - [Is the Env variable required?](#is-the-env-variable-required)
  - [How do I use ES modules?](#how-do-i-use-es-modules)

[Contributing Guide](#contributing-guide)

## Installation

```bash
# with npm
npm install @noshot/env

# or with yarn
yarn add @noshot/env
```

## Usage

In a CLI or within your package.json, under the `scripts` property, define [CLI Options](#cli-options) before running a process. Then `@noshot/env` will load the `.env.*` files according to their defined `paths` order (left to right), where the last imported file will take precedence over any previously imported files.

For example, `.env.*` files can loaded by an [Env Configuration File](#env-configuration-file) file via [LOAD_CONFIG](#load_config):

```json
{
  "scripts": {
    "dev": "LOAD_CONFIG=development node test.js",
    "staging": "LOAD_CONFIG=staging node app.js"
  },
  "dependencies": {
    "@noshot/env": "^x.x.x"
  }
}
```

All you need to do now is `require`/`import` the `@noshot/env` base package as early as possible:

```javascript
require("@noshot/env");
// import '@noshot/env';
```

Optionally, you can [preload](#preload) your `.env.*` files instead!

## Env Configuration File

The easiest and cleanest way to load `.env.*` files is to create an **env.config.json** configuration file located at the **project's root directory**. The configuration file will be a JSON object that follows the [config argument options](#config-argument-options) pattern. The environment configuration naming is unopinionated -- they can be named anything you'd like (for example: `dev`, `staging`, `prepublish`, `testing`, and so on):

**env.config.json**
```json
{
  "development": {
    "debug": true,
    "paths": [".env.base", ".env.dev"],
    "override": true
  },
  "production": {
    "paths": ".env.prod",
  },
  "test": {
    "dir": "custom/path/to/directory",
    "paths": [".env.base", ".env.dev"],
  }
}
```

Then in your `package.json`, add a [LOAD_CONFIG](#load_config) variable to load one of the configurations by an environment name (the environment name must match one of environments specified in the configuration file above):
```json
{
  "scripts": {
    "dev": "LOAD_CONFIG=development node app.js"
  },
  "dependencies": {
    "@noshot/env": "^x.x.x"
  }
}
```

Then, either [preload](#preload) or import the `@noshot/env` package as early as possible to load the `development` Envs.

```json
{
 "development": {
    "debug": true,
    "paths": [".env.base", ".env.dev"],
    "override": true
  }
}
```

## CLI Options

#### LOAD_CONFIG

By defining a `LOAD_CONFIG` variable, this will let `@noshot/env` know you'd like to load an **env.config.json** configuration file according to a specific environment name. The environment naming is unopinionated -- they can be named anything you'd like (for example: `dev`, `staging`, `prepublish`, `testing` and so on); however, the environment name **must** match one of environments specified in the configuration file.

```json
{
  "scripts": {
    "dev": "LOAD_CONFIG=development node app.js"
  },
  "dependencies": {
    "@noshot/env": "^x.x.x"
  }
}
```

**env.config.json**
```json
{
  "development": {
    "debug": true,
    "paths": [".env.base", ".env.dev"],
    "override": true
  },
  "production": {
    "paths": ".env.prod",
  },
  "test": {
    "dir": "custom/path/to/directory",
    "paths": [".env.base", ".env.dev"],
  }
}
```

Note: Defining any of the options within the configuration file **WILL NOT** change the default behavior of `config`, `load` or `parse` methods.

## Preload

You can use the `--require` (`-r`) [command line option](https://nodejs.org/api/cli.html#cli_r_require_module) with `@noshot/env` to preload your `.env.*` files! By doing so, you do not need to `require`/`import` the `@noshot/env` package within your project.

CLI:
```bash
$ LOAD_CONFIG=dev node -r @noshot/env app.js
```

Package.json:
```json
{
  "scripts": {
    "dev": "LOAD_CONFIG=dev node -r @noshot/env app.js"
  },
  "dependencies": {
    "@noshot/env": "^x.x.x"
  }
}
```

## Config Method

If you wish to manaully import `.env.*` files, then the config method will read your `.env.*` files, parse the contents, assign them to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env), and return an `Object` with `parsed` and `extracted` Envs:

```js
const env = require("@noshot/env");
// import env from "@noshot/env";

const result = env.config();

console.log("parsed", result.parsed); // process.env with loaded Envs
console.log("extracted", result.extracted); // extracted Envs within a { KEY: VALUE } object
```

Additionally, you can pass [argument options](#config-argument-options) to `config`.

### Config Argument Options

The `config` method accepts a single `Object` argument with the following properties: 
```js
{ 
  dir?: string, 
  paths?: string | string[], 
  encoding?: BufferEncoding,
  override?: boolean | string,
  debug?: boolean | string
}
```

#### Config dir

**Default:** `process.cwd()` (project root directory)

You may specify a single directory path if your files are located elsewhere.

A single directory path as a `string`:

```js
require("@noshot/env").config({ dir: "custom/path/to/directory" });

// import { config } from "@noshot/env";
// config({ dir: "custom/path/to/directory" });
```

#### Config paths

**Default:** `[".env"]`

You may specify custom paths if your files are located elsewhere (recommended to use **absolute** path(s) from your root directory).

A single file path as a `string`:

```js
require("@noshot/env").config({ paths: "custom/path/to/.env" });

// import { config } from "@noshot/env";
// config({ paths: "custom/path/to/.env" });
```

Multiple file paths as a single `string` separated by commas:

```js
require("@noshot/env").config({
  paths: "custom/path/to/.env,custom/path/to/.env.base"
});

// import { config } from "@noshot/env";
// config({ paths: "custom/path/to/.env,custom/path/to/.env.base" });
```

Or multiple file paths as an `Array` of `string`s:

```js
require("@noshot/env").config({
  paths: ["custom/path/to/.env", "custom/path/to/.env.base"]
});

// import { config } from "@noshot/env";
// config({ paths: ["custom/path/to/.env", "custom/path/to/.env.base"] });
```

It's highly recommended that you utilize [dir](#config-dir) if you're loading from a single custom directory:
```js
require("@noshot/env").config({ dir: "custom/path/to/directory", paths: [".env", ".env.base"] });

// import { config } from "@noshot/env";
// config({ dir: "custom/path/to/directory", paths: [".env", ".env.base"] });
```

#### Config encoding

**Default:** `utf-8`

You may specify the encoding [type](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) of your file containing environment variables.

```js
require("@noshot/env").config({ encoding: "latin1" });

// import { config } from "@noshot/env";
// config({ encoding: "latin1" });
```

#### Config override

**Default:** `false`

You may specify whether or not to override Envs in [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env). 

```js
require("@noshot/env").config({ override: true });

// import { config } from "@noshot/env";
// config({ override: true });
```

#### Config debug

**Default:** `undefined`

You may turn on logging to help debug file loading.

```js
require("@noshot/env").config({ debug: true });

// import { config } from "@noshot/env";
// config({ debug: true });
```

## Parse Method

If you wish to manually parse Envs, then you can utilize `parse` to read a string or Buffer and parse their contents.

### Parse Argument Options

The `parse` method accepts two arguments in the following order: 
```
src: string | Buffer, 
override: boolean | string | undefined
```

#### Parse src

For some use cases, you may want to pass parse a `string` or `Buffer` which returns parsed `extracted` keys/values as a single `Object`. These will **NOT** be assigned to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env). [Why not?](#why-doesnt-the-parse-method-automatically-assign-envs)

```js
const { readFileSync } = require("fs");
const { parse } = require("@noshot/env");
// import { readFileSync } from "fs";
// import { parse } from "@noshot/env";

const config = parse(Buffer.from("BASIC=basic")); // will return an object
console.log(typeof config, config); // object - { BASIC : 'basic' }

const results = parse(readFileSync("path/to/.env.file", { encoding: "utf8" })); // will return an object
console.log(typeof results, results); // object - { KEY : 'value' }
```

Note: If you're attempting to parse Envs that have already been defined within [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env), then you must pass `parse` an [override](#parse-override) argument.

#### Parse override

If you wish to extract and potentially override Envs in [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env), then you can pass a `boolean` or `string` (passing `"false"` will still be truthy) as a second argument to parse. These will **NOT** be assigned to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env). [Why not?](#why-doesnt-the-parse-method-automatically-assign-envs)

```js
const { readFileSync } = require("fs");
const { parse } = require("@noshot/env");
// import { readFileSync } from "fs";
// import { parse } from "@noshot/env";

const config = parse(Buffer.from("BASIC=basic"), true); // will return an object
console.log(typeof config, config); // object - { BASIC : 'basic' }

const result = parse(readFileSync("path/to/.env.file", { encoding: "utf8" }), true); // will return an object
console.log(typeof result, result); // object - { OVERRIDEKEY : 'value' }
```

### Parse Rules

The parsing method currently supports the following rules:

- `BASIC=basic` becomes `{BASIC: 'basic'}`
- empty lines are skipped
- lines beginning with `#` are treated as comments
- empty values become empty strings (`EMPTY=` becomes `{EMPTY: ''}`)
- inner quotes are maintained (think JSON) (`JSON={"foo": "bar"}` becomes `{JSON:"{\"foo\": \"bar\"}"`)
- single and double quoted values are escaped (`SINGLE_QUOTE='quoted'` becomes `{SINGLE_QUOTE: "quoted"}`)
- single and double quoted values maintain whitespace from both ends (`FOO=" some value "` becomes `{FOO: ' some value '}`)
- double quoted values expand new lines `MULTILINE="new\nline"` becomes

```
{MULTILINE: 'new
line'}
```

## Load Method

If you wish to manually load the **env.config.json** configuration file, then you can utilize the `load` method. Please note that this **synchronously** retrieves the environment configuration from the **env.config.json** configuration file, but will not automatically assign any Envs; instead, you'll have to manually pass its returned environment configuration to the [config method](#config-method).

### Load Argument Options

The `load` method accepts two arguments in the following order: 
```
env: string, 
dir: string | undefined
```

#### Load env

For some use cases, you may want to manually load the **env.config.json** configuration file and pass its returned environment configuration to the [config method](#config-method). To do so, pass `load` an environment name as the first argument:

```js
const { config, load } = require("@noshot/env");
// import { config, load } from "@noshot/env";

const configArgs = load("development"); // will return an object of config arguments
console.log(typeof configArgs, configArgs) // object - { paths: ".env.dev", debug: true }
config(configArgs) // parses .env.dev and assigns it to process.env
```

#### Load dir

For some use cases, you may want to manually load an **env.config.json** configuration file that is **not** located at the project's root directory and pass its returned environment configuration to the [config method](#config-method). To do so, pass `load` an environment name as the first argument and an absolute directory path as a second argument:

```js
const { config, load } = require("@noshot/env");
// import { config, load } from "@noshot/env";

const configArgs = load("development", "path/to/custom/directory"); // will return an object of config arguments
console.log(typeof configArgs, configArgs) // object - { paths: ".env.dev", debug: true }
config(configArgs) // parses .env.dev and assigns it to process.env
```

## Decrypt Method

If you wish to manaully decrypt an encrypted string, then the decrypt method will parse the string and return an `Object` with `decryptedEnvs` as a string `KEY=value` string and `decryptedJSON` Envs as `{ "KEY": "value" }` parsed `JSON`.

The `decrypt` method accepts a single `Object` argument with the following **required** properties (see [Encryption and Decryption Arguments](#encryption-and-decryption-arguments) for more details): 
```js
{ 
  algorithm: string, 
  envs: string, 
  encoding: BufferEncoding,
  input: Encoding,
  iv: string,
  secret: CipherKey
}
```

Example:
```js
const env = require("@noshot/env");
// import env from "@noshot/env";

const result = env.decrypt({ 
  algorithm: "aes-256-cbc", 
  envs: "b8cb1867e4a8248c839db9cb0f1e1d", 
  encoding: "utf8", 
  input: "hex", 
  iv: "05c6f2c47de0ecfe", 
  secret: "abcdefghijklmnopqrstuv1234567890" 
});

console.log(typeof decryptedEnvs, result.decryptedEnvs); // string - a single string of "KEY=value" pairs
console.log(typeof decryptedJSON, result.decryptedJSON); // object - { KEY: VALUE } JSON object
```

## Encrypt Method

If you wish to manaully encrypt a flat stringified JSON object, then the encrypt method will encrypt the string and return an `Object` with `encryptedEvs` and an [`iv`](#encryptdecrypt-iv).

The `encrypt` method accepts a single `Object` argument with the following **required** properties (see [Encryption and Decryption Arguments](#encryption-and-decryption-arguments) for more details): 
```js
{ 
  algorithm: string, 
  envs: string, 
  encoding: BufferEncoding,
  input: Encoding,
  secret: CipherKey
}
```

Example:
```js
const env = require("@noshot/env");
// import env from "@noshot/env";

const result = env.encrypt({ 
  algorithm: "aes-256-cbc", 
  envs: JSON.stringify({ "KEY": "value" }), 
  encoding: "utf8", 
  input: "hex", 
  secret: "abcdefghijklmnopqrstuv1234567890" 
});

console.log(typeof encryptedEvs, result.encryptedEvs); // string - a single encrypted string
console.log(typeof iv, result.iv); // string - a random encryption/decryption string
```

## Encryption and Decryption Arguments

Encryption and decryption methods share similar arguments, here's a breakdown of each one:

### Encrypt/Decrypt algorithm

The `algorithm` argument is a `string` that is dependent on OpenSSL, see list below for examples. On recent OpenSSL releases, `openssl list -cipher-algorithms` (`openssl list-cipher-algorithms` for older versions of OpenSSL) will display the available cipher algorithms for your version.

### Encrypt/Decrypt envs

The `envs` argument is, depending on the method, either a stringified JSON object ([encrypt method](#encrypt-method)) or a single encrypted string ([decrypt method](#decrypt-method)) of Envs.

Encrypt:
```
"{ "KEY": "value" }"
```

Decrypt (value derived from the encrypt method):
```
b8cb1867e4a8248c839db9cb0f1e1d
```

### Encrypt/Decrypt encoding

Both methods expect the `encoding` argument to be a `string` type of character [BufferEncoding](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings).

### Encrypt/Decrypt input

Both methods expect the `input` argument to be a `string` type of either `base64` or `hex`.

### Encrypt/Decrypt iv

The `iv`, or [Initialization Vector](https://en.wikipedia.org/wiki/Initialization_vector), is a randomly generated string that is used to encrypt or decrypt a single string. Since it's randomly generated and unique to when it was created, ideally, it should be stored on a disk inaccessible to the source machine. Missplacing or forgetting the `iv` will mean that you have to regenerate a new encrypted string to retrieve a new iv. This `iv` should **never** be commited to version control!

### Encrypt/Decrypt secret

The `secret` should be a randomly generated [CipherKey (see `key`)](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options) that is one byte in length and is used to encrypt or decrypt a single string. This `secret` should **never** be commited to version control!

## Extending Local .env Files

Local `.env.*` file can be extended by adding `# extends:` __magic comments__ followed by `absolute/path/to/.env`. These __magic comments__ can be stacked within a single `.env.*` file:

**.env.example**
```dosini
# extends: .env
# extends: .env.base
MESSAGE=Hello World
```

Output:
```dosini
ROOT=true
BASE=true
MESSAGE=Hello World
```

And/or they can be recursively extended:

**.env.example**
```dosini
# extends: .env.base
MESSAGE=Hello World
```

**.env.base**
```dosini
# extends: .env
BASE=true
```

**.env**
```dosini
ROOT=true
```

Output:
```dosini
ROOT=true
BASE=true
MESSAGE=Hello World
```

⚠️ Please note that extending `.env.*` files that don't exist will silently fail.

## Fetching Remote .env Files

⚠️ Support for this feature is in beta. It utilizes the [curl command](https://www.tutorialspoint.com/unix_commands/curl.htm) within a bash script which requires a Unix based operating system and/or Windows 10 v1803+. For now, this package expects the response body from the remote url to be encrypted plain text.

Envs can be fetched by adding `# uses:` __magic comments__ followed by 6 arguments with spaces between them (**do NOT use new lines, only spaces**):

```
remoteurl: string 
algorithm: string
secretkey: string
iv: string
input: Encoding
output: BufferEncoding
```

For example:

**remote url**
```
https://domain.com/encryptedJSON.txt
```

**algorithm** (see list below)
```
aes-256-cbc
```

**secret key**
```
abcdefghijklmnopqrstuv1234567890
```

**[iv (Initialization Vector)](https://en.wikipedia.org/wiki/Initialization_vector)**
```
05c6f2c47de0ecfe
```

**input (type of encoding used to encrypt the JSON object)**
```
hex
```

**[output (type of encoding to decrypt the response)](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings)**
```
utf8
```

**JSON Object**
```json
{
  "ABC": "123",
  "DEF": "678",
  "HIJ": "$ABC$DEF"
}
```

**encryptedJSON.txt**
```
2ad5a38779ca444fe63773ed3771b6d9d52ceb7c6672823be594879d5dba50132f13ef647e2a69060e7e5f0f296c6fd3
```

**.env.example**
```dosini
# uses: https://domain.com/encryptedJSON.txt aes-256-cbc abcdefghijklmnopqrstuv1234567890 05c6f2c47de0ecfe hex utf8
REMOTEFILE=true
```

Output:
```dosini
ABC=123
DEF=456
HIJ=123456
REMOTE_FILE=true
```

## Interpolation

Env values can be interpolated based upon a [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) value, a `KEY` within the `.env.*` file, a command line substitution and/or a fallback value. 

To interpolate a value from [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) or `.env.*`, simply define it with either `$KEY` or within brackets `${KEY}`, for example:

Input:
```dosini
MESSAGE=Hello
INTERP_MESSAGE=$MESSAGE World
INTERP_MESSAGE_BRACKETS=${MESSAGE} World
ENVIRONMENT=$NODE_ENV
```

Output:
```dosini
MESSAGE=Hello
INTERP_MESSAGE=Hello World
INTERP_MESSAGE_BRACKETS=Hello World
ENVIRONMENT=development
```

To interpolate a value with a **single** fallback value use the `|` symbol beside a `$KEY` or inside a `${KEY}`, for example:

Input:
```dosini
MESSAGE=Hello
INTERP_MESSAGE=$MESSAGE|Hello World
INTERP_MESSAGE_BRACKETS=${MESSAGE|Hello} World
FALLBACK_VALUE=$UNDEFINED_KEY|Hello
FALLBACK_VALUE_BRAKCETS=${UNDEFINED_KEY|Hello}
FALLBACK_VALUE_WITH_INTERP=$UNDEFINED_KEY|$MESSAGE
```

Output:
```dosini
MESSAGE=Hello
INTERP_MESSAGE=Hello World
INTERP_MESSAGE_BRACKETS=Hello World
FALLBACK_VALUE=Hello
FALLBACK_VALUE_BRAKCETS=Hello
FALLBACK_VALUE_WITH_INTERP=Hello
```

To interpolate a command line substitution, simply define it within parentheses `$(KEY)` for example:

Input:
```dosini
USER=$(whoami)
MULTICOMMAND=$(echo 'I Would Have Been Your Daddy' | sed 's/[^A-Z]//g')
```

Output:
```dosini
USER=Jane
MULTICOMMAND=IWHBYD
```

### Interpolation Rules

- Values can be interpolated based upon a [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) value: `BASIC=$NODE_ENV` || `BASIC=${NODE_ENV}`
- Values in [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) take precedence over interpolated values in `.env.*` files
- Interpolated values can't be referenced across multiple `.env.*`s, instead they must only be referenced within the same file
- Command line substitutions can **NOT** contain bash commands that use parentheses: `EX=$(info=$(uname -a); echo $info;)`, instead its recommended to use `.sh` files instead:  `EX=$(bash ./path/to/info.sh)`
- Fallback values can **NOT** be used with command line substitutions
- The `$` character **must** be escaped when it doesn't refer to another key within the `.env.*` file: `\$1234`
- Do not use escaped `\$` within a value when it's key is referenced by another key: 

Input:
```dosini
A=\$example
B=$A
```

Output:
```dosini
A=$example
B=
```

Fix:
```dosini
A=example
B=\$$A
```

Output:
```dosini
A=example
B=$example
```

## FAQ

### Should I commit my `.env.*` files?

No. It's **strongly** recommended not to commit your `.env.*` files to version control. They'll include environment-specific values such as database passwords and API keys that should not be public. Commiting the `env.config.json` file is OK, as it won't/shouldn't contain any secrets.

On the same note, most CI (continous integration) services like Github Actions and CircleCI offer their own Env configuration options for CI actions, so commiting `.env.*` files is unnecessary.

### Does this package allow submodule imports?

Yes! You can import submodules directly by their name:

```js
const assign = require("@noshot/env/assign").default;
// import assign from "@noshot/env/assign";

const config = require("@noshot/env/config").default;
// import config from "@noshot/env/config";

const load = require("@noshot/env/load").default;
// import load from "@noshot/env/load";

const parse = require("@noshot/env/parse").default;
// import parse from "@noshot/env/parse";
```

### How does @noshot/env work and will it override already set or predefined variables?

By default, `@noshot/env` will look for the `.env.*` file(s) defined within a `LOAD_CONFIG` environment variable and append them to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env).

For example, `LOAD_CONFIG=development` loads two files `.env.base` and `.env.dev` from [env.config.json](#env-configuration-file):

```json
{
  "scripts": {
    "dev": "LOAD_CONFIG=development node app.js"
  },
  "dependencies": {
    "@noshot/env": "^x.x.x"
  }
}
```

in a local environment, `.env.base` may have static shared database variables:

```dosini
DB_HOST=localhost
DB_USER=root
DB_PASS=password
```

while `.env.dev` may have environment specific variables:

```dosini
DB_PASS=password123
HOST=http://localhost
PORT=3000
```

`@noshot/env` will parse the files and append the Envs in the order of how they were defined in [paths](#config-paths). In the example above, the `DB_PASS` variable within `.env.base` would be overidden by `.env.dev` because `.env.dev` file was imported last and, as a result, its `DB_PASS` will be assigned to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env).

By default, Envs that are **pre-set** or **defined** within [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) **WILL NOT be overidden**. If you wish to override variables in [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) or [Config Override](#config-override) or [Parse Override](#parse-override).

### Why doesn't the parse method automatically assign Envs?

In short, `parse` can not automatically assign Envs as they're extracted.

Why?

Under the hood, the `config` method utilizes the `parse` method to extract one or multiple `.env.*` files as it loops over the `config` [paths](#config-paths) argument. The `config` method expects `parse` to return a single `Object` of extracted Envs that will be accumulated with other files' extracted Envs. The result of these accumulated Envs is then assigned to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) **once** -- this approach has the added benefit of prioritizing Envs  without using **any** additional logic since the last set of extracted Envs automatically override any previous Envs (by leveraging [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Merging_objects_with_same_properties)). While allowing Envs to be assigned multiple times to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env) doesn't appear to be much different in terms of performance, it unforuntately requires quite a bit more additional overhead logic to determine which `.env.*` has priority and whether or not to *conditionally* assign them (including times when you might want to parse Envs, but not neccesarily assign them). A workaround to this limitation is to simply assign them yourself:

```js
const { assign, parse } = require("@noshot/env");
// import { assign, parse } from "@noshot/env";

const parsed = parse(Buffer.from("BASIC=basic")); // parse/interpolate Envs not defined in process.env
// const parsed = parse(Buffer.from("BASIC=basic"), true); // parse/interpolate and override any Envs in process.env

assign(parsed); // assigns parsed Envs to process.env
```

### Is the Env variable required?

To be as flexible as possible, the Env variable ([LOAD_CONFIG](#load_config)) is not required to set Envs to [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env). However, you will then be required to use this package similarly to how you would use dotenv:

```js
const { config } = require("@noshot/env");
// import { config } from "@noshot/env";

config({ ... });
```

Check out the [Config Method](#config-method) and [Config Arguments](#config-argument-options) for more information about manually loading `.env.*` files.

### How do I use ES modules?

As of Node v12.17.0+, node removed the experimental flag for ES modules. Unfortunately, most of development world has yet to adopt ESM as the standard. Therefore, until there's more widespread support, this documentation will caution against using ESM and instead opt for CJS. In addition, node doesn't support [preloading](#preload) ESM, since preloading utilizes Node's `require` function. That said, this package offers **experimental** support for ESM. You can try it out by importing from the `esm` directory of the package:

```js
import env from "@noshot/env/esm";
// import { assign, config, load, parse } from "@noshot/env/esm";
// import config from "@noshot/env/esm/config";
```

## Contributing Guide

See [CONTRIBUTING.md](CONTRIBUTING.md)

