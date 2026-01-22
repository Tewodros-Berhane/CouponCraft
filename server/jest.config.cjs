module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
