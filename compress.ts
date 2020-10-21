import fs from "fs";
import { minify } from "terser";

const options = {
  compress: {
    warnings: false,
    comparisons: false,
    inline: 2
  },
  mangle: {
    safari10: true
  },
  output: {
    comments: false,
    ascii_only: true
  }
};

const files = ["lib/config.js", "lib/index.js", "lib/parse.js"];

(async () => {
  try {
    await Promise.all(
      files.map(async file => {
        const { code } = await minify(
          fs.readFileSync(file, { encoding: "utf-8" }),
          options
        );
        if (code) fs.writeFileSync(file, code, { encoding: "utf-8" });
      })
    );
  } catch (error) {
    /* eslint-disable-next-line */
    console.error(error);
    process.exit(1);
  }
})();
