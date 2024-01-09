/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  testTimeout: 3000,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["node_modules"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json",
    },
  },
};
