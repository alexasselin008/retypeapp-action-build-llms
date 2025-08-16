
import path from "path";
import { describe, expect, it } from "vitest";
import { readRetypeConfig } from "../../src/configuration/readRetypeConfig.ts";

const configs = [
    {
        name: "pocketpy-pocketpy.yml",
        file: path.resolve(__dirname, "test-configs/yml/pocketpy-pocketpy.yml")
    },
    {
        name: "retypeapp-retype.yml",
        file: path.resolve(__dirname, "test-configs/yml/retypeapp-retype.yml")
    },
    {
        name: "workleap-wl-telemetry.yml",
        file: path.resolve(__dirname, "test-configs/yml/workleap-wl-telemetry.yml")
    },
    {
        name: "artrepreneur-docs.json",
        file: path.resolve(__dirname, "test-configs/json/artrepreneur-docs.json")
    },
    {
        name: "the-hacking-trove.json",
        file: path.resolve(__dirname, "test-configs/json/the-hacking-trove.json")
    }
];

describe("readRetypeConfig", () => {
    configs.forEach(({ name, file }) => {
        it(`parses ${name} without throwing`, async () => {
            await expect(readRetypeConfig(file)).resolves.toBeDefined();
        });
    });
});
