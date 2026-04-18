import pc from "picocolors";
const TAGLINE = "Workflows for AI agents";
const AUTHOR = "Dante";
const AUTHOR_EMAIL = "datapod.k@gmail.com";
const REPO_URL = "https://github.com/seungyeoul-knou/watermelon";
const COMMUNITY_URL = "https://watermelon.work";
const LOGO_LINES = [
    "  ____  _            _  ___          _ ",
    " | __ )| |_   _  ___| |/ (_)_      _(_)",
    " |  _ \\| | | | |/ _ \\ ' /| \\ \\ /\\ / / |",
    " | |_) | | |_| |  __/ . \\| |\\ V  V /| |",
    " |____/|_|\\__,_|\\___|_|\\_\\_| \\_/\\_/ |_|",
];
const INDENT = " ".repeat(9);
function colored(line) {
    return pc.cyan(pc.bold(line));
}
function infoLine(label, value) {
    return pc.dim(`${INDENT}${label.padEnd(10)} ${value}`);
}
export function renderLogo(opts) {
    const subtitle = opts?.subtitle ?? TAGLINE;
    const lines = [
        "",
        ...LOGO_LINES.map(colored),
        "",
        pc.italic(pc.dim(`${INDENT}${subtitle}`)),
        "",
        infoLine("Author:", `${AUTHOR} <${AUTHOR_EMAIL}>`),
        infoLine("Source:", REPO_URL),
        infoLine("Community:", COMMUNITY_URL),
        "",
    ];
    return lines.join("\n");
}
export function printLogo(opts) {
    console.log(renderLogo(opts));
}
export function printCompactLogo() {
    console.log("");
    console.log(`${colored(" Watermelon ")} ${pc.dim(`— ${TAGLINE} · by ${AUTHOR}`)}`);
    console.log(pc.dim(`            ${REPO_URL}  ·  ${COMMUNITY_URL}`));
    console.log("");
}
export function formatVersionLine(current, latest) {
    if (!latest)
        return `${pc.bold("Version:")} ${pc.cyan(`v${current}`)}`;
    if (latest === current) {
        return `${pc.bold("Version:")} ${pc.cyan(`v${current}`)} ${pc.green("(latest)")}`;
    }
    return `${pc.bold("Version:")} ${pc.cyan(`v${current}`)} ${pc.dim("→")} ${pc.green(`v${latest}`)}`;
}
