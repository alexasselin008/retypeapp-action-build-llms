import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYAML } from "yaml";
import { z } from "zod";
import { RETYPE_FILENAMES, RetypeConfigSchema, type RetypeConfig } from "./retypeSchemas.ts";

export function findRetypeConfig(configPath: string) {
    const stat = fs.statSync(configPath);

    if (stat.isFile()) {
        const ext = path.extname(configPath).toLowerCase();
        if ([".yml", ".yaml", ".json"].includes(ext)) {
            return configPath;
        }
        throw new Error(`Invalid file type: ${configPath}`);
    }

    if (stat.isDirectory()) {
        for (const filename of RETYPE_FILENAMES) {
            const candidate = path.join(configPath, filename);
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }
        throw new Error(
            `No retype config found in directory: ${configPath}. Expected one of ${RETYPE_FILENAMES.join(", ")}`
        );
    }

    throw new Error("No retype config found");
}


export async function readRetypeConfig(filePath: string): Promise<RetypeConfig> {
    const raw = await readFile(filePath, "utf8");

    let data: RetypeConfig;
    try {
        // Works for .yml, .yaml, and .json
        data = parseYAML(raw);
    } catch (e) {
        const err = e as Error;
        err.message = `Failed to parse config at ${filePath}: ${err.message}`;
        throw err;
    }

    try {
        const result = RetypeConfigSchema.parse(data);

        return result;
    } catch (e) {
        // Pretty print Zod issues next to the file path
        if (e instanceof z.ZodError) {
            const issues = e.issues
                .map(i => `${i.path.join(".") || "<root>"}: ${i.message}`)
                .join("\n  ");
            const err = new Error(
                `Retype config at ${filePath} was not in an expected format:\n  ${issues}`
            );
            err.cause = e;
            throw err;
        }
        throw e;
    }
}
