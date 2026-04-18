import { existsSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { installSkills, pruneSkills, uninstallSkills, } from "./skills-helper.js";
// Continue.dev loads MCP server "blocks" from ~/.continue/mcpServers/.
// We install a Watermelon-owned YAML file so uninstall is a single unlink and
// the user's other MCP servers stay untouched. YAML 1.2 is a superset of
// JSON, so we emit JSON-flavored values to avoid needing a YAML parser.
const BASE = join(homedir(), ".continue");
const SKILLS_DIR = join(BASE, "skills");
const MCP_DIR = join(BASE, "mcpServers");
const MCP_CONFIG = join(MCP_DIR, "watermelon.yaml");
function quote(value) {
    return JSON.stringify(value);
}
function buildYaml(config) {
    const argsLines = config.args.length === 0
        ? ["    args: []"]
        : ["    args:", ...config.args.map((a) => `      - ${quote(a)}`)];
    const envEntries = Object.entries(config.env);
    const envLines = envEntries.length === 0
        ? ["    env: {}"]
        : [
            "    env:",
            ...envEntries.map(([k, v]) => `      ${quote(k)}: ${quote(v)}`),
        ];
    return [
        "# Managed by Watermelon CLI — do not edit manually.",
        "name: watermelon",
        "version: 0.0.1",
        "schema: v1",
        "mcpServers:",
        "  - name: watermelon",
        `    command: ${quote(config.command)}`,
        ...argsLines,
        ...envLines,
        "",
    ].join("\n");
}
export class ContinueAdapter {
    name = "continue";
    displayName = "Continue.dev";
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
        mkdirSync(MCP_DIR, { recursive: true });
        writeFileSync(MCP_CONFIG, buildYaml(config));
    }
    uninstall() {
        uninstallSkills(SKILLS_DIR);
        if (existsSync(MCP_CONFIG)) {
            rmSync(MCP_CONFIG, { force: true });
        }
    }
}
