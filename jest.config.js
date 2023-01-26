module.exports = {
  bail: false,
  roots: ["<rootDir>/tests/integration", "<rootDir>/tests/unitary"],
  transform: {
    "^.+\\.spec.(t|j)s?$": ["@swc/jest"],
  },
  setupFilesAfterEnv: ["./setupTests.ts"],
  preset: "ts-jest",
  transformIgnorePatterns: ["node_modules"],
  testEnvironment: "jsdom",
};
