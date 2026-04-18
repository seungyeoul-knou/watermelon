import { startCommand } from "./start.js";
import { stopCommand } from "./stop.js";
export async function restartCommand(options = {}) {
    await stopCommand(options.profile);
    await startCommand(options);
}
