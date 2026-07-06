#!/usr/bin/env node
/**
 * Copies the shared WALLS favicon into each app under `app/icon.svg`.
 *
 * Skips any app that already defines its own icon in `app/`:
 *   favicon.ico | icon.ico | icon.png | icon.jpg | icon.jpeg | icon.svg | icon.tsx | icon.jsx
 *   apple-icon.png | apple-icon.jpg | apple-icon.ico
 *
 * Usage: pnpm sync:icons
 */

import { copyFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const monorepoRoot = path.resolve(packageRoot, "../..");
const appsDir = path.join(monorepoRoot, "apps");
const sourceIcon = path.join(packageRoot, "assets", "icon.svg");

const OVERRIDE_PATTERNS = [
  /^favicon\.ico$/i,
  /^icon\.(ico|png|jpe?g|svg|tsx|jsx)$/i,
  /^apple-icon\.(ico|png|jpe?g)$/i,
];

function hasAppIconOverride(appDir) {
  const appRouterDir = path.join(appDir, "app");
  if (!existsSync(appRouterDir)) return false;

  return readdirSync(appRouterDir).some((name) =>
    OVERRIDE_PATTERNS.some((pattern) => pattern.test(name)),
  );
}

function syncAppIcon(appName) {
  const appDir = path.join(appsDir, appName);
  const target = path.join(appDir, "app", "icon.svg");

  if (!existsSync(path.join(appDir, "app"))) {
    console.log(`skip ${appName}: no app/ directory`);
    return;
  }

  if (hasAppIconOverride(appDir)) {
    console.log(`skip ${appName}: custom icon in app/`);
    return;
  }

  copyFileSync(sourceIcon, target);
  console.log(`synced ${appName}/app/icon.svg`);
}

function main() {
  if (!existsSync(sourceIcon)) {
    console.error(`Missing shared icon at ${sourceIcon}`);
    process.exit(1);
  }

  const apps = readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const app of apps) {
    syncAppIcon(app);
  }
}

main();
