module.exports = () => {
  return {
    rootDir: process.cwd(),
    testTimeout: 30000,
    testEnvironment: "node",
    verbose: true,
    testPathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/dist"],
    modulePathIgnorePatterns: ["<rootDir>/dist"],
    roots: ["<rootDir>/tests"],
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    transform: {
      "^.+\\.(ts)$": "ts-jest",
    },
    collectCoverageFrom: ["src/**/*.ts"],
    collectCoverage: true,
    coverageDirectory: "./coverage",
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: -10,
      },
    },
  };
};
