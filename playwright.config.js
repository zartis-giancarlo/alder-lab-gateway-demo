import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://localhost:3410" },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "node src/server.js",
    url: "http://localhost:3410/api/rule",
    reuseExistingServer: false,
  },
});
