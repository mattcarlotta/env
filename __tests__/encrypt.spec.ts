import encrypt from "../encrypt";

describe("Encrypt Method", () => {
  it("encrypts a stringified JSON object and returns an 'encryptedEvs' and 'iv'", () => {
    const envString = JSON.stringify({
      ABC: "123",
      DEF: "678",
      HIJ: "$ABC$DEF"
    });

    const { encryptedEvs, iv } = encrypt({
      algorithm: "aes-256-cbc",
      envs: envString,
      encoding: "utf8",
      input: "hex",
      secret: "abcdefghijklmnopqrstuv1234567890"
    });

    expect(encryptedEvs).toEqual(expect.any(String));
    expect(iv).toEqual(expect.any(String));
  });
});
