import * as core from "@actions/core";
import fs from "node:fs";
import path from "node:path";
import { readRetypeConfig } from "./configuration/readRetypeConfig.ts";

interface ActionInputs {
    /**
     * Custom folder to store the output from the Retype build process.
     * @default `""` (empty).
     */
    output?: string;
    /**
     * JSON configuration overriding project config values.
     * @default `""` (empty).
     */
    override?: string;
    /**
     * Enable verbose logging during build process.
     * @default false
     */
    verbose?: boolean;
    /**
     * Path to the retype.yml file. May point to a directory, a JSON or YAML
     * file. If a directory, Retype will look for the 'retype.[yml|yaml|json]'
     * file in this directory.
     * @default ""
     */
    config_path?: string;
}

interface ActionOutput {
    /**
     * Path to the Retype output that can be referenced in other steps
      within the same workflow.
     */
    "retype-output-path"?: string;
}
const RETYPE_FILENAMES = ["retype.yml", "retype.yaml", "retype.json"];

function getOptionalInput<T extends keyof ActionInputs>(name: T) {
    return core.getInput(name) as ActionInputs[T];
}

function setOutput<T extends keyof ActionOutput>(name: T, value: ActionOutput[T]) {
    core.setOutput(name, String(value));
}

function listFiles(dir: string) {
    // TODO: won't work with node 20
    const files = fs.readdirSync(dir, { encoding: "utf8", recursive: true });

    return files;
}

function findRetypeConfig(configPath: string) {
    const stat = fs.statSync(path.resolve(configPath));

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

(async () => {
    const output = getOptionalInput("output");
    const override = getOptionalInput("override");
    const verbose = getOptionalInput("verbose") ?? false;
    const config_path = getOptionalInput("config_path") ?? "";

    const configTest = path.resolve(".");
    const configTest2 = path.resolve(process.cwd(), ".");
    core.info(`Config Test: ${configTest}`);
    core.info(`Config Test 2: ${configTest2}`);
    core.info(`Inputs AA ${output} |  ${override} |  ${verbose} | ${config_path}`);

    if (verbose) {
        core.info(`Inputs ${output} ${override} ${verbose} ${config_path}`);
    }

    const resolvedConfigPath = findRetypeConfig(config_path);
    const config = await readRetypeConfig(resolvedConfigPath);

    if (verbose) {
        core.info(`Config Detected at ${resolvedConfigPath}: ${JSON.stringify(config)}`);
    }

    const mdxFilesLocations = config.input ?? ".";
    const test = path.resolve(mdxFilesLocations);
    const test2 = path.resolve(process.cwd(), mdxFilesLocations);

    if (verbose) {
        core.info(`Trying to resolve input folder: ${mdxFilesLocations} ${test} ${test2}`);
    }

    const mdxFiles = listFiles(mdxFilesLocations);

    if (verbose) {
        core.info(`Files to process: ${JSON.stringify(mdxFiles)}`);
    }

    const outputPath = output ?? config.output ?? ".retype";
    setOutput("retype-output-path", outputPath);

    return;
})().catch(err => {
    core.error(err);
    core.setFailed(err.message);
});


