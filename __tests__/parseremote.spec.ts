import { execSync } from "child_process";
import parse from "../parse";

jest.mock("child_process", () => ({
  __esModule: true,
  execSync: jest.fn()
}));

(execSync as jest.Mock)
  .mockReturnValueOnce(
    "27de7609362ff6aaef4d367a84a6288c23c879977e562c05862f73be2c00388367fc6c7135c19e5edeafef24929814639c4b772e58c6a4c0adde4b4c7c715ab6e12fd80987a0d216daeeaeda63c67a3034aa3e9d9a5c70fe177dbd68d43fd585429c108e116f4bf684df42de660be7ce6e81fb8c797a9dad068b7a4969e1ffe40a3ffad68b6ce68dd55772aad9b098fa6e01674fa7b0be29814daf00f5f6d6cf158c82c8b55191c3559c71b2e3096bf9cc8e9756e2701f922034de0b4b0d066c9b12ef36d320e9585bacec62ad4a1f991c50bbe818063b3de7ced18f37e758cab4ff7d6caa7018780db8df3fbbbfb9b1790b8c70c7bc394e944c5f93d8727cd16a91f299b8f372f64278eea204ece99979e98a3dc426828843833b8e5bade2ea5544112fe1fa91a75208e828bf70ae2d25a81a22dc243786e17cb3678748a5c0"
  )
  .mockReturnValueOnce("");

describe("Parse Remoth Files Method", () => {
  it("parses envs from a remote url", () => {
    const result = parse(
      Buffer.from(
        "# uses: https://good.url.com aes-256-cbc k762mailLG90WZpIuQItp870eJNNunF5 6b85461c9929331d hex utf-8\nREMOTEFILE=true"
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
        "# uses: https://invalid.invalid.com aes-256-cbc k762mailLG90WZpIuQItp870eJNNunF5 6b85461c9929331d hex utf-8\nREMOTEFILE=false"
      )
    );

    expect(result).toEqual({
      REMOTEFILE: "false"
    });
  });
});
