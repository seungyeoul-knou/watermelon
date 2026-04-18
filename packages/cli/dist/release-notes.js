const NPM_REGISTRY = "https://registry.npmjs.org/watermelon/latest";
const GITHUB_REPO = "seungyeoul-knou/watermelon";
const FETCH_TIMEOUT_MS = 4000;
async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(url, {
            signal: controller.signal,
            headers: { "User-Agent": "watermelon-cli" },
        });
        return res;
    }
    catch {
        return null;
    }
    finally {
        clearTimeout(timer);
    }
}
export async function getLatestVersion() {
    const res = await fetchWithTimeout(NPM_REGISTRY);
    if (!res || !res.ok)
        return null;
    const json = (await res.json().catch(() => null));
    return json?.version ?? null;
}
async function fetchCompareCommits(fromTag, toTag) {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/compare/${fromTag}...${toTag}`;
    const res = await fetchWithTimeout(url);
    if (!res || !res.ok)
        return null;
    const json = (await res.json().catch(() => null));
    if (!json?.commits)
        return null;
    return json.commits.map((c) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
    }));
}
async function fetchReleaseBody(tag) {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/releases/tags/${tag}`;
    const res = await fetchWithTimeout(url);
    if (!res || !res.ok)
        return null;
    const json = (await res.json().catch(() => null));
    const body = json?.body?.trim() ?? "";
    // GitHub auto-generated bodies are just "**Full Changelog**: ..." — treat as empty
    if (!body || /^\*\*Full Changelog\*\*:/i.test(body))
        return null;
    return body;
}
export async function getReleaseNotes(fromVersion, toVersion) {
    const fromTag = `v${fromVersion}`;
    const toTag = `v${toVersion}`;
    const compareUrl = `https://github.com/${GITHUB_REPO}/compare/${fromTag}...${toTag}`;
    const [body, commits] = await Promise.all([
        fetchReleaseBody(toTag),
        fromVersion !== toVersion ? fetchCompareCommits(fromTag, toTag) : null,
    ]);
    if (!body && (!commits || commits.length === 0))
        return null;
    return {
        tag: toTag,
        body: body ?? undefined,
        commits: commits ?? undefined,
        compareUrl,
    };
}
