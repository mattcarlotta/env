/**
 * A utility function that attempts to `import`/`require` a JavaScript `env.config.(m)js` file.
 *
 * @param module - path to config file
 * @returns an object configuration
 */
export async function importModule(module: string): Promise<any> {
  try {
    return require(module);
  } catch (err: any) {
    if (err.code === "ERR_REQUIRE_ESM") {
      const { default: defaultExport } = await import(module);
      return defaultExport;
    }
    throw err;
  }
}

export default importModule;
