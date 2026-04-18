/**
 * rebuild-native.mjs
 * Runs after `npm install -g watermelon` to download the correct
 * better-sqlite3 prebuilt binary for the user's platform.
 *
 * The npm tarball intentionally excludes the .node binary
 * (stripped by bundle-assets.mjs) so every platform gets
 * the right one via prebuild-install at install time.
 */
import { execFileSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const sqliteDir = join(
  here,
  "..",
  "dist",
  "assets",
  "app-runtime",
  "node_modules",
  "better-sqlite3",
);

if (!existsSync(sqliteDir)) {
  process.exit(0);
}

mkdirSync(join(sqliteDir, "build", "Release"), { recursive: true });

const isWin = process.platform === "win32";
// On Windows, execFileSync cannot resolve .cmd extensions without shell
const execOpts = { cwd: sqliteDir, stdio: "inherit", shell: isWin };

console.log(
  `[watermelon] Installing better-sqlite3 for ${process.platform}-${process.arch}...`,
);

try {
  execFileSync("npx", ["-y", "prebuild-install"], {
    ...execOpts,
    timeout: 60_000,
  });
  console.log("[watermelon] better-sqlite3 native binary ready.");
} catch {
  try {
    console.log("[watermelon] Prebuilt not available, compiling from source...");
    execFileSync("npx", ["-y", "node-gyp", "rebuild", "--release"], {
      ...execOpts,
      timeout: 120_000,
    });
    console.log("[watermelon] better-sqlite3 compiled successfully.");
  } catch (e) {
    console.warn(
      "[watermelon] Warning: Could not build better-sqlite3 native module.",
    );
    console.warn("  'watermelon start' (local SQLite mode) will not work.");
    console.warn("  Docker mode is unaffected.");
    console.warn(`  Error: ${e.message ?? e}`);
  }
}
