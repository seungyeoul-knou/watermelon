import { BUNDLED_MCP_PATH, BUNDLED_SKILLS } from "./assets/index.js";
import { requireProfile } from "./config.js";
import { getAllAdapters } from "./runtimes/detect.js";
export function applyProfileToRuntimes(config, profileName, runtimeNames) {
    const { profile } = requireProfile(config, profileName);
    const targetNames = runtimeNames ?? config.runtimes;
    const allAdapters = getAllAdapters();
    const installed = [];
    for (const name of targetNames) {
        const adapter = allAdapters.find((item) => item.name === name);
        if (!adapter)
            continue;
        adapter.installSkills(BUNDLED_SKILLS);
        adapter.installMcp({
            command: "node",
            args: [BUNDLED_MCP_PATH],
            env: {
                WATERMELON_API_URL: profile.server_url,
                WATERMELON_API_KEY: profile.api_key,
            },
        });
        installed.push(name);
    }
    return installed;
}
export function pruneBundledSkills(config) {
    const bundledNames = new Set(BUNDLED_SKILLS.map((skill) => skill.name));
    for (const adapter of getAllAdapters()) {
        if (!config.runtimes.includes(adapter.name))
            continue;
        adapter.installSkills(BUNDLED_SKILLS);
        adapter.pruneSkills(bundledNames);
    }
}
