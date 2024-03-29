module.exports = {
  "testEnvironment": "node",
  "moduleDirectories": ["<rootDir>", "node_modules"],
  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },
  "testMatch": ["**/*.spec.ts"],
  "transformIgnorePatterns": ["^.+\\.js$"],
  "testPathIgnorePatterns": [
    "<rootDir>/coverage",
    "<rootDir>/esm",
    "<rootDir>/node_modules",
    "<rootDir>/types",
    "<rootDir>/utils"
  ],
  "collectCoverageFrom": ["**/*.ts", "!**/*d.ts", "!utils/*.ts", "!importFile/*.ts"]
}
