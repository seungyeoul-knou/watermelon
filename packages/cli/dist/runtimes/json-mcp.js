import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { installSkills, pruneSkills, uninstallSkills, } from "./skills-helper.js";
export class JsonMcpAdapter {
    name;
    displayName;
    baseDir;
    skillsDir;
    resolvePaths;
    displayPath;
    serversKey;
    entryKey;
    buildEntry;
    isInstalledFn;
    constructor(opts) {
        this.name = opts.name;
        this.displayName = opts.displayName;
        this.baseDir = opts.baseDir;
        this.skillsDir = opts.skillsDir ?? join(opts.baseDir, "skills");
        if (typeof opts.mcpConfigPath === "function") {
            const fn = opts.mcpConfigPath;
            this.resolvePaths = fn;
            this.displayPath = opts.displayPath ?? "<multiple>";
        }
        else {
            const path = opts.mcpConfigPath;
            this.resolvePaths = () => [path];
            this.displayPath = path;
        }
        this.serversKey = opts.serversKey ?? "mcpServers";
        this.entryKey = opts.entryKey ?? "watermelon";
        this.buildEntry = opts.buildEntry ?? ((c) => c);
        this.isInstalledFn = opts.isInstalled ?? (() => existsSync(this.baseDir));
    }
    isInstalled() {
        return this.isInstalledFn();
    }
    getSkillsDir() {
        return this.skillsDir;
    }
    getMcpConfigPath() {
        return this.displayPath;
    }
    installSkills(skills) {
        installSkills(this.skillsDir, skills);
    }
    pruneSkills(keep) {
        pruneSkills(this.skillsDir, keep);
    }
    installMcp(config) {
        const entry = this.buildEntry(config);
        for (const path of this.resolvePaths()) {
            mkdirSync(dirname(path), { recursive: true });
            const existing = this.readJson(path);
            const servers = existing[this.serversKey] ??
                {};
            servers[this.entryKey] = entry;
            existing[this.serversKey] = servers;
            writeFileSync(path, JSON.stringify(existing, null, 2));
        }
    }
    uninstall() {
        uninstallSkills(this.skillsDir);
        for (const path of this.resolvePaths()) {
            if (!existsSync(path))
                continue;
            const existing = this.readJson(path);
            const servers = existing[this.serversKey];
            if (servers)
                delete servers[this.entryKey];
            writeFileSync(path, JSON.stringify(existing, null, 2));
        }
    }
    // Reads the target config file as JSON. If the file is missing, returns
    // an empty object so install/uninstall can create it. If the file exists
    // but cannot be parsed, fails closed by throwing — otherwise install
    // would rewrite `{}` back and silently erase the user's unrelated
    // settings (theme, other MCP servers, editor preferences, etc.).
    readJson(path) {
        if (!existsSync(path))
            return {};
        const raw = readFileSync(path, "utf8");
        try {
            return JSON.parse(raw);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            throw new Error(`Watermelon CLI cannot parse existing MCP config at ${path}: ${message}. ` +
                `The file has been left untouched. Fix the JSON manually or remove the file ` +
                `and retry.`);
        }
    }
}
