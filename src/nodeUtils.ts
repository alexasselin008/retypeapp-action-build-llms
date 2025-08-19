import fs from "node:fs";
import path from "node:path";

/**
 * This is doable natively with node 22+, but we need to support node 20
 */
export function readDirRecursiveSync(dir: string) {
    const result: string[] = [];

    for (const entry of fs.readdirSync(dir, { encoding: "utf8", withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            result.push(...readDirRecursiveSync(fullPath));
        } else {
            result.push(fullPath);
        }
    }

    return result;
}
