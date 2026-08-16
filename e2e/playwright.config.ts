import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173",
  },
  webServer: [
    {
      command: `cd ${repoRoot} && npm run dev --workspace services/api`,
      url: "http://localhost:3001/cards",
      reuseExistingServer: true,
    },
    {
      command: `cd ${repoRoot} && npm run dev --workspace apps/web`,
      url: "http://localhost:5173",
      reuseExistingServer: true,
    },
  ],
});
