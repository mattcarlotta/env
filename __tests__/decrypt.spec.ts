import decrypt from "../decrypt";

const envString = {
  ABC: "123",
  DEF: "678",
  HIJ: "$ABC$DEF"
};

const envBuffer = Buffer.from(`ABC=123\nDEF=678\nHIJ=$ABC$DEF`);

describe("Decrypt Method", () => {
  it("decrypts an encrypted JSON string and returns 'decryptedEnvs' and 'decryptedResult'", () => {
    const { decryptedEnvs, decryptedResult } = decrypt({
      algorithm: "aes-256-cbc",
      envs: "d4b6baef6ae9313a17b3f736a4e28ba35f4f23a74397a06f75fefe7acc777b81570a12ccee82ff4e2c05f148dce3b17c",
      encoding: "utf8",
      input: "hex",
      iv: "507e1b56bd09de07",
      secret: "abcdefghijklmnopqrstuv1234567890"
    });

    expect(decryptedEnvs).toEqual("ABC=123\nDEF=678\nHIJ=$ABC$DEF");
    expect(decryptedResult).toEqual(envString);
  });

  it("decrypts an encrypted Buffer string and returns 'decryptedEnvs' and 'decryptedResult'", () => {
    const { decryptedEnvs, decryptedResult } = decrypt({
      algorithm: "aes-256-cbc",
      envs: "025d83b7518e7b63b3c2394c412deaecb07f23551f17a40fca415d39da0e5333",
      encoding: "utf8",
      input: "hex",
      iv: "8ebd7a9decfeefd5",
      secret: "abcdefghijklmnopqrstuv1234567890"
    });

    expect(decryptedEnvs).toEqual("ABC=123\nDEF=678\nHIJ=$ABC$DEF");
    expect(decryptedResult).toEqual(envBuffer);
  });
});
