import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync, unlinkSync, } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
const CONFIG_VERSION = "2.0.0";
export const DEFAULT_PROFILE = "default";
export const CONFIG_PATH = join(homedir(), ".watermelon", "config.json");
function nowIso() {
    return new Date().toISOString();
}
function coerceUser(value) {
    const raw = (value ?? {});
    return {
        id: typeof raw.id === "number" ? raw.id : 0,
        username: typeof raw.username === "string" ? raw.username : "unknown",
        email: typeof raw.email === "string" ? raw.email : "",
        role: typeof raw.role === "string" ? raw.role : "viewer",
    };
}
function coerceRuntimes(value) {
    if (!Array.isArray(value))
        return [];
    return value.filter((item) => typeof item === "string");
}
function normalizeProfileName(name) {
    const trimmed = name?.trim();
    return trimmed ? trimmed : DEFAULT_PROFILE;
}
function isLegacyConfig(value) {
    const raw = value;
    return (!!raw &&
        typeof raw.server_url === "string" &&
        typeof raw.api_key === "string");
}
function normalizeProfile(name, raw) {
    if (!raw ||
        typeof raw.server_url !== "string" ||
        typeof raw.api_key !== "string") {
        return null;
    }
    return {
        name,
        server_url: raw.server_url,
        api_key: raw.api_key,
        user: coerceUser(raw.user),
        installed_at: typeof raw.installed_at === "string" ? raw.installed_at : nowIso(),
        last_used: typeof raw.last_used === "string" ? raw.last_used : nowIso(),
    };
}
function migrateLegacyConfig(raw) {
    const profile = normalizeProfile(DEFAULT_PROFILE, {
        name: DEFAULT_PROFILE,
        server_url: raw.server_url,
        api_key: raw.api_key,
        user: raw.user,
        installed_at: raw.installed_at,
        last_used: raw.last_used,
    });
    return {
        version: CONFIG_VERSION,
        active_profile: DEFAULT_PROFILE,
        profiles: profile ? { [DEFAULT_PROFILE]: profile } : {},
        runtimes: coerceRuntimes(raw.runtimes),
    };
}
function normalizeConfig(raw) {
    if (isLegacyConfig(raw)) {
        return migrateLegacyConfig(raw);
    }
    const value = raw;
    if (!value || typeof value !== "object" || value.profiles == null) {
        return null;
    }
    const profiles = {};
    for (const [name, profileValue] of Object.entries(value.profiles)) {
        const normalized = normalizeProfile(name, profileValue);
        if (normalized)
            profiles[name] = normalized;
    }
    const profileNames = Object.keys(profiles);
    if (profileNames.length === 0)
        return null;
    const requestedActive = typeof value.active_profile === "string" ? value.active_profile : undefined;
    const activeProfile = profiles[requestedActive ?? ""]
        ? requestedActive
        : profiles[DEFAULT_PROFILE]
            ? DEFAULT_PROFILE
            : profileNames[0];
    return {
        version: typeof value.version === "string" ? value.version : CONFIG_VERSION,
        active_profile: activeProfile,
        profiles,
        runtimes: coerceRuntimes(value.runtimes),
    };
}
export function loadConfig() {
    if (!existsSync(CONFIG_PATH))
        return null;
    try {
        const raw = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
        const normalized = normalizeConfig(raw);
        if (!normalized)
            return null;
        if (JSON.stringify(raw, null, 2) !== JSON.stringify(normalized, null, 2)) {
            saveConfig(normalized);
        }
        return normalized;
    }
    catch {
        return null;
    }
}
export function createEmptyConfig() {
    return {
        version: CONFIG_VERSION,
        active_profile: DEFAULT_PROFILE,
        profiles: {},
        runtimes: [],
    };
}
export function saveConfig(config) {
    mkdirSync(dirname(CONFIG_PATH), { recursive: true, mode: 0o700 });
    writeFileSync(CONFIG_PATH, JSON.stringify({
        ...config,
        version: CONFIG_VERSION,
    }, null, 2), { mode: 0o600 });
    chmodSync(CONFIG_PATH, 0o600);
}
export function clearConfig() {
    if (existsSync(CONFIG_PATH))
        unlinkSync(CONFIG_PATH);
}
export function requireConfig() {
    const config = loadConfig();
    if (!config) {
        throw new Error("Not authenticated. Run `npx watermelon accept <token> --server <url>` first.");
    }
    return config;
}
export function getProfile(config, profileName) {
    const resolved = normalizeProfileName(profileName ?? config.active_profile);
    const profile = config.profiles[resolved];
    if (!profile)
        return null;
    return { name: resolved, profile };
}
export function requireProfile(config, profileName) {
    const resolved = getProfile(config, profileName);
    if (!resolved) {
        throw new Error(`Unknown profile '${normalizeProfileName(profileName)}'. Use \`watermelon profile list\` to see configured profiles.`);
    }
    return resolved;
}
export function upsertProfile(config, profile, options) {
    const next = {
        ...config,
        profiles: {
            ...config.profiles,
            [profile.name]: profile,
        },
    };
    if (options?.activate) {
        next.active_profile = profile.name;
    }
    else if (!next.active_profile) {
        next.active_profile = profile.name;
    }
    return next;
}
export function removeProfile(config, profileName) {
    const nextProfiles = { ...config.profiles };
    delete nextProfiles[profileName];
    const remaining = Object.keys(nextProfiles);
    if (remaining.length === 0)
        return null;
    const nextActive = config.active_profile === profileName
        ? nextProfiles[DEFAULT_PROFILE]
            ? DEFAULT_PROFILE
            : remaining[0]
        : config.active_profile;
    return {
        ...config,
        active_profile: nextActive,
        profiles: nextProfiles,
    };
}
export { normalizeProfileName };
