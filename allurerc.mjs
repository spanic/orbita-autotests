import { defineConfig } from "allure";

export default defineConfig({
  name: "Orbita Autotests",
  output: "./allure-report",
  historyPath: "./allure-history.jsonl",
});
