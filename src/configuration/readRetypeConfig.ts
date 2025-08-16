import { readFile } from "node:fs/promises";
import { parse as parseYAML } from "yaml";
import { z } from "zod";
import { RetypeConfigSchema, type RetypeConfig } from "./retypeSchema.ts";

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
