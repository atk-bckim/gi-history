import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT ?? process.env.PORT ?? 3000);
const host = process.env.PLAYWRIGHT_HOST ?? "localhost";
const baseURL = `http://${host}:${port}`;

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  timeout: 30_000,
  workers: 1,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run dev -- --hostname ${host} --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--enable-webgl",
            "--ignore-gpu-blocklist",
            "--use-angle=swiftshader",
          ],
        },
        viewport: { width: 1440, height: 1100 },
      },
    },
  ],
});
