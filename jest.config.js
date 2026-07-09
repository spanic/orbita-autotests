/** @type {import('jest').Config} */

const path = require("path");

const config = {
  rootDir: path.join(__dirname, "__tests__"),
  preset: "ts-jest",
  testEnvironment: "allure-jest/node",
};

module.exports = config;
