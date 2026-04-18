import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { installSkills, pruneSkills, uninstallSkills, } from "./skills-helper.js";
const BASE = join(homedir(), ".codex");
const SKILLS_DIR = join(BASE, "skills");
const MCP_CONFIG = join(BASE, "config.toml");
const SECTION_REGEX = /\n?\[mcp_servers\.watermelon[\s\S]*?(?=\n\[(?!mcp_servers\.watermelon)|$)/g;
export class CodexAdapter {
    name = "codex";
    displayName = "Codex CLI";
    isInstalled() {
        return existsSync(BASE);
    }
    getSkillsDir() {
        return SKILLS_DIR;
    }
    getMcpConfigPath() {
        return MCP_CONFIG;
    }
    installSkills(skills) {
        installSkills(SKILLS_DIR, skills);
    }
    pruneSkills(keep) {
        pruneSkills(SKILLS_DIR, keep);
    }
    installMcp(config) {
        mkdirSync(BASE, { recursive: true });
        const envLines = Object.entries(config.env)
            .map(([key, value]) => `${key} = "${value}"`)
            .join("\n");
        const snippet = `\n[mcp_servers.watermelon]\n` +
            `command = "${config.command}"\n` +
            `args = ${JSON.stringify(config.args)}\n\n` +
            `[mcp_servers.watermelon.env]\n${envLines}\n`;
        const existing = existsSync(MCP_CONFIG)
            ? readFileSync(MCP_CONFIG, "utf8")
            : "";
        writeFileSync(MCP_CONFIG, existing.replace(SECTION_REGEX, "") + snippet);
    }
    uninstall() {
        if (existsSync(MCP_CONFIG)) {
            const existing = readFileSync(MCP_CONFIG, "utf8");
            writeFileSync(MCP_CONFIG, existing.replace(SECTION_REGEX, ""));
        }
        uninstallSkills(SKILLS_DIR);
    }
}
