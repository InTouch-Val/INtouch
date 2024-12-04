/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx, ts, tsx}"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setup-test.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "^.+\\.svg$": "jest-svg-transformer",
    "^.+\\.css$": "identity-obj-proxy",
    "^.+.scss$": "identity-obj-proxy",
  },
};

export default config;
