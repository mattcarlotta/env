import fs from "fs";
import parse from "../parse";
import { logWarning } from "../log";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

const parsed = parse(fs.readFileSync("tests/.env", { encoding: "utf8" }));

describe("Parse Method", () => {
  it("returns an object", () => {
    expect(parsed).toEqual(expect.any(Object));
  });

  it("sets basic attributes", () => {
    expect(parsed.BASIC).toEqual("basic");
  });

  it("reads after a skipped line", () => {
    expect(parsed.AFTER_LINE).toEqual("after_line");
  });

  it("defaults empty values to empty string", () => {
    expect(parsed.EMPTY).toEqual("");
  });

  it("escapes single quoted values", () => {
    expect(parsed.SINGLE_QUOTES).toEqual("single_quotes");
  });

  it("respects surrounding spaces in single quotes", () => {
    expect(parsed.SINGLE_QUOTES_SPACED).toEqual("    single quotes    ");
  });

  it("escapes double quoted values", () => {
    expect(parsed.DOUBLE_QUOTES).toEqual("double_quotes");
  });

  it("respects surrounding spaces in double quotes", () => {
    expect(parsed.DOUBLE_QUOTES_SPACED).toEqual("    double quotes    ");
  });

  it("doesn't respect newlines if not double quoted", () => {
    expect(parsed.EXPAND_NEWLINES).toEqual("expand\nnew\nlines");
    expect(parsed.DONT_EXPAND_UNQUOTED).toEqual("dontexpand\\nnewlines");
    expect(parsed.DONT_EXPAND_SQUOTED).toEqual("dontexpand\\nnewlines");
  });

  it("ignores commented lines", () => {
    expect(parsed.COMMENTS).toBeUndefined();
  });

  it("respects equals signs in values", () => {
    expect(parsed.EQUAL_SIGNS).toEqual("equals==");
  });

  it("retains inner quotes", () => {
    expect(parsed.RETAIN_INNER_QUOTES).toEqual('{"foo": "bar"}');
    expect(parsed.RETAIN_INNER_QUOTES_AS_STRING).toEqual('{"foo": "bar"}');
  });

  it("retains leading double quote", () => {
    expect(parsed.RETAIN_LEADING_DQUOTE).toEqual('"retained');
  });

  it("retains leading single quote", () => {
    expect(parsed.RETAIN_LEADING_SQUOTE).toEqual("'retained");
  });

  it("reatins trailing double quote", () => {
    expect(parsed.RETAIN_TRAILING_DQUOTE).toEqual('retained"');
  });

  it("retains trailing single quote", () => {
    expect(parsed.RETAIN_TRAILING_SQUOTE).toEqual("retained'");
  });

  it("retains spaces in string", () => {
    expect(parsed.TRIM_SPACE_FROM_UNQUOTED).toEqual("some spaced out string");
  });

  it("parses email addresses correctly", () => {
    expect(parsed.USERNAME).toEqual("therealnerdybeast@example.tld");
  });

  it("parses keys and values surrounded by spaces", () => {
    expect(parsed.SPACED_KEY).toEqual("parsed");
  });

  it("parses a buffer into an object", () => {
    const payload = parse(Buffer.from("BUFFER=true"));
    expect(payload.BUFFER).toEqual("true");
  });

  it("parses (\\r) line endings", () => {
    const expectedPayload = {
      SERVER: "localhost",
      PASSWORD: "password",
      DB: "tests"
    };
    const RPayload = parse(
      Buffer.from("SERVER=localhost\rPASSWORD=password\rDB=tests\r")
    );
    expect(RPayload).toEqual(expectedPayload);

    const NPayload = parse(
      Buffer.from("SERVER=localhost\nPASSWORD=password\nDB=tests\n")
    );
    expect(NPayload).toEqual(expectedPayload);

    const RNPayload = parse(
      Buffer.from("SERVER=localhost\r\nPASSWORD=password\r\nDB=tests\r\n")
    );
    expect(RNPayload).toEqual(expectedPayload);
  });

  it("parses default substitutions", () => {
    const result = parse(
      Buffer.from(
        `DEFAULT_VALUE=\${DEFAULT|hello}\nDEFAULT_EXAMPLE=$DEFAULT|hello\nENVNMT=$UNDFINED|$NODE_ENV`
      )
    );

    expect(result).toEqual(
      expect.objectContaining({
        DEFAULT_VALUE: "hello",
        DEFAULT_EXAMPLE: "hello",
        ENVNMT: "test"
      })
    );
  });

  it("parses single command-line substitutions", () => {
    let result = parse(
      Buffer.from(
        "MESSAGE=$(echo 'Welcome To The Mad House' | sed 's/[^A-Z]//g')"
      )
    );

    expect(result.MESSAGE).toEqual("WTTMH");
  });

  it("parses multiple command-line substitutions", () => {
    const result = parse(Buffer.from(`ADMIN=$(echo 'Bob') $(echo "Smith")`));

    expect(result.ADMIN).toEqual("Bob Smith");
  });

  it("parses and interopolates command-line substitutions", () => {
    const result = parse(
      Buffer.from(`ADMIN=$(echo 'Bob')@$(echo "Smith")\nDBADMIN=$ADMIN`)
    );

    expect(result.ADMIN).toEqual("Bob@Smith");
    expect(result.DBADMIN).toEqual("Bob@Smith");
  });

  it("handles invalid command-line substitutions", () => {
    parse(Buffer.from("INVALIDCOMMAND=$(invalid)"));

    expect(logWarning).toHaveBeenCalledTimes(1);
  });

  it("extends envs that contain '# extends path/to/.env'", () => {
    const result = parse(
      Buffer.from("# extends: tests/.env.extends2\nEXTENDED=true")
    );

    expect(result).toEqual({
      ROOT: "true",
      FIRSTNAME: "Jane",
      LASTNAME: "Doe",
      EXTENDED: "true"
    });
  });

  it("extends envs that contain multiple '# extends path/to/.env' statements", () => {
    const result = parse(
      Buffer.from(
        "# extends: tests/.env.extends2\n# extends: tests/.env.extends3\nMULTIEXTENDED=true"
      )
    );

    expect(result).toEqual({
      ROOT: "true",
      FIRSTNAME: "Jane",
      LASTNAME: "Doe",
      MULTIPASS: "Leeloo",
      MULTIEXTENDED: "true"
    });
  });

  it("doesn't parse envs that contain invalid extension paths", () => {
    const result = parse(
      Buffer.from("# extends: tests/.env.invalid\nEXTENDED=false")
    );

    expect(result).toEqual({
      EXTENDED: "false"
    });
  });

  it("parses envs from a remote url", () => {
    const result = parse(
      Buffer.from(
        "# uses: https://gist.githubusercontent.com/mattcarlotta/501898bb46ee4740d13a2548e2690fdf/raw/bec095780324d763ca4c6103cb4c76d60048ce28/envsync.txt aes-256-cbc k762mailLG90WZpIuQItp870eJNNunF5 6b85461c9929331d hex utf-8\nREMOTEFILE=true"
      )
    );

    expect(result).toEqual({
      FACEBOOK_PAGE: "http://facebook.com/foo",
      FAVICON_URL: "/favicon.ico",
      LOCALE: "en",
      LOGO_DOMAIN: "placekitten.com",
      LOGO_HEIGHT: "80",
      LOGO_URL: "http://placekitten.com.com/250/80",
      LOGO_WIDTH: "250",
      TAGLINE: "Your site tagline",
      TITLE: "Your site title",
      TWITTER_ACCOUNT: "foo",
      REMOTEFILE: "true"
    });
  });

  it("doesn't parse envs from an invalid remote url", () => {
    const result = parse(
      Buffer.from(
        "# uses: https://invalid.invalid.com aes-256-cbc k762mailLG90WZpIuQItp870eJNNunF5 6b85461c9929331d hex utf-8\nREMOTEFILE=true"
      )
    );

    expect(result).toEqual({
      REMOTEFILE: "true"
    });
  });
});
