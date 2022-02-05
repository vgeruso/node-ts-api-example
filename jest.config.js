/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  collectCoverageFrom: ["src/**"],
  coverageDirectory: "__tests__/coverage"
};