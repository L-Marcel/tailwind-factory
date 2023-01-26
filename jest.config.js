module.exports = {
  bail: false,
  roots: ["<rootDir>/src/tests/integration", "<rootDir>/src/tests/unitary"],
  transform: {
    "^.+\\.spec.(t|j)s?$": ["@swc/jest"],
  },
  setupFilesAfterEnv: ["./setupTests.ts"],
  preset: "ts-jest",
  transformIgnorePatterns: ["node_modules"],
  testEnvironment: "jsdom",
};
