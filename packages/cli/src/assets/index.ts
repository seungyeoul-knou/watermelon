import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import type { SkillBundle } from "../runtimes/base.js";

const here = dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = join(here, "skills");

export const BUNDLED_SKILLS: SkillBundle[] = [
  "wm-start",
  "wm-next",
  "wm-status",
  "wm-rewind",
  "wm-approve",
  "wm-instruction",
  "wm-credential",
  "wm-design",
  "wm-import",
  "wm-improve",
  "wm-report",
  "wm-scan",
  "wm-share",
  "wm-version",
  "wm-help",
].map((name) => ({
  name,
  content: readFileSync(join(SKILLS_ROOT, name, "SKILL.md"), "utf8"),
}));

export const BUNDLED_MCP_PATH = join(here, "mcp", "server.js");
