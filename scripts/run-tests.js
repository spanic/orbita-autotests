const { spawnSync } = require("child_process");
const fs = require("fs");

const jestResult = spawnSync("jest", process.argv.slice(2), {
  stdio: "inherit",
  shell: true,
});

// Generates allure report automatically even if tests fail
spawnSync("allure", ["awesome", "./allure-results"], { stdio: "inherit" });

process.exit(jestResult.status ?? 1);
