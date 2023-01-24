module.exports = {
  bail: false,
  roots: ["<rootDir>/src/tests/"],
  transform: {
    "^.+\\.spec.(t|j)s?$": ["@swc/jest"],
  },
  preset: "ts-jest",
  transformIgnorePatterns: ["node_modules"],
  testEnvironment: "node",
};
