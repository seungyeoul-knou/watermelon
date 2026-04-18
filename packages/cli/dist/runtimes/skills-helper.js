import { existsSync, mkdirSync, writeFileSync, readdirSync, rmSync } from "fs";
import { join } from "path";
// All Watermelon-installed skills are prefixed with "wm-" so we can safely
// prune or uninstall them without touching the user's other skill files.
const SKILL_PREFIX = "wm-";
export function installSkills(skillsDir, skills) {
    mkdirSync(skillsDir, { recursive: true });
    for (const skill of skills) {
        const dir = join(skillsDir, skill.name);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "SKILL.md"), skill.content);
    }
}
export function pruneSkills(skillsDir, keep) {
    if (!existsSync(skillsDir))
        return;
    for (const entry of readdirSync(skillsDir)) {
        if (entry.startsWith(SKILL_PREFIX) && !keep.has(entry)) {
            rmSync(join(skillsDir, entry), { recursive: true, force: true });
        }
    }
}
export function uninstallSkills(skillsDir) {
    if (!existsSync(skillsDir))
        return;
    for (const entry of readdirSync(skillsDir)) {
        if (entry.startsWith(SKILL_PREFIX)) {
            rmSync(join(skillsDir, entry), { recursive: true, force: true });
        }
    }
}
