/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  verbose: true,
  testEnvironment: "node",
  // globalSetup: "<rootDir>/src/tests/globalSetup.ts",
  // roots: ["<rootDir>"],
  // transform: {
  //   "^.+\\.(t|j)sx?$": ["@swc/jest"],
  // },
  testTimeout: 900000,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/tests/MockSetup/fileMock.js",
    "\\.(css|scss)$": "<rootDir>/src/tests/MockSetup/emptyModule.js",
  },
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["node_modules"],
};
