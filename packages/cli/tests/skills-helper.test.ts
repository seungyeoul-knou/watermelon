import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  installSkills,
  pruneSkills,
  uninstallSkills,
} from "../src/runtimes/skills-helper.js";

describe("skills-helper", () => {
  let dir: string;

  beforeEach(() => {
    dir = join(
      tmpdir(),
      `wm-skills-${process.pid}-${Date.now()}-${Math.random()}`,
    );
  });

  afterEach(() => {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  });

  it("installSkills writes SKILL.md per bundle", () => {
    installSkills(dir, [
      { name: "wm-a", content: "# A" },
      { name: "wm-b", content: "# B" },
    ]);
    expect(readFileSync(join(dir, "wm-a", "SKILL.md"), "utf8")).toBe("# A");
    expect(readFileSync(join(dir, "wm-b", "SKILL.md"), "utf8")).toBe("# B");
  });

  it("installSkills creates missing parent directory", () => {
    expect(existsSync(dir)).toBe(false);
    installSkills(dir, [{ name: "wm-a", content: "x" }]);
    expect(existsSync(join(dir, "wm-a"))).toBe(true);
  });

  it("pruneSkills removes wm-* entries not in keep set", () => {
    installSkills(dir, [
      { name: "wm-a", content: "x" },
      { name: "wm-b", content: "y" },
    ]);
    // A non-watermelon user skill should survive.
    mkdirSync(join(dir, "user-custom"), { recursive: true });
    writeFileSync(join(dir, "user-custom", "SKILL.md"), "mine");

    pruneSkills(dir, new Set(["wm-a"]));

    const remaining = readdirSync(dir).sort();
    expect(remaining).toEqual(["user-custom", "wm-a"]);
  });

  it("pruneSkills is a no-op when the directory doesn't exist", () => {
    expect(() => pruneSkills(dir, new Set())).not.toThrow();
  });

  it("uninstallSkills removes every wm-* entry but leaves non-wm files intact", () => {
    installSkills(dir, [{ name: "wm-a", content: "x" }]);
    mkdirSync(join(dir, "user-custom"), { recursive: true });
    writeFileSync(join(dir, "user-custom", "SKILL.md"), "mine");

    uninstallSkills(dir);

    expect(existsSync(join(dir, "wm-a"))).toBe(false);
    expect(existsSync(join(dir, "user-custom"))).toBe(true);
  });
});
