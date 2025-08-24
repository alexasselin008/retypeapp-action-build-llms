import * as core from "@actions/core";
import path from "node:path";
import { LlmsFileBuilder } from "./LLMsFileBuilder.ts";
import { findRetypeConfig, readRetypeConfig } from "./readRetypeConfig.ts";

interface ActionInputs {
    /**
     * Custom folder to store the output from the Retype build process.
     * @default `""` (empty).
     */
    output?: string;
    /**
     * Give a brief description of the project. A short summary of the project's purpose and goals is great for LLMs file.
     * @default `""` (empty).
     */
    description?: string;
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

function getOptionalInput<T extends keyof ActionInputs>(name: T) {
    return core.getInput(name) as ActionInputs[T];
}

(async () => {
    const output = getOptionalInput("output");
    const verbose = getOptionalInput("verbose") ?? false;
    const description = getOptionalInput("description");
    const config_path = getOptionalInput("config_path") ?? "";

    if (verbose) {
        core.info(`Inputs: ${JSON.stringify({ output, verbose, config_path, description })}`);
    }

    const resolvedConfigPath = findRetypeConfig(path.resolve(config_path ?? "."));

    if (verbose) {
        core.info(`Config Path is ${resolvedConfigPath}}`);
    }

    const config = await readRetypeConfig(resolvedConfigPath);

    if (verbose) {
        core.info(`Config Detected at ${resolvedConfigPath}: ${JSON.stringify(config)}`);
    }

    const mdxFilesLocations = path.resolve(config.input ?? ".");

    if (verbose) {
        core.info(`Trying to resolve input folder: ${mdxFilesLocations}`);
    }

    // const mdxFiles = readDirRecursiveSync(mdxFilesLocations);

    // if (verbose) {
    //     core.info(`Files to process: ${JSON.stringify(mdxFiles)}`);
    // }

    const projectTitle = config.branding?.title;
    const title = `# ${projectTitle} - Documentation for LLMs`;

    if (!config.url) {
        core.warning("The retype config does not have an url. We can't properly link to other files with absolute links.");
    }

    const llmsBuilder = new LlmsFileBuilder(title, config.url ?? ".");
    llmsBuilder.addDescription(description);


    // TODO: what if there is no url??
    // expected output:
    // ## Introduction
    // [Getting Started](https://workleap.github.io/wl-logging/introduction/getting-started/)
    // ## Reference
    // [BrowserConsoleLogger](....)

    // Samples

    // ## Useful links
    // [Home](https://retypeapp.com/)    -> Validates if this maps to
    // [Found a bug?](https://retypeapp.com/)
    // [Feature requests](https://retypeapp.com/)
    // [Releases](https://retypeapp.com/)
    // [Github](https://retypeapp.com/)
    // [NPM](https://retypeapp.com/)
    const content = llmsBuilder.build();

    if (verbose) {
        core.info(`LLMs.txt file: ${content}`);
    }

    const outputPath = output ?? config.output ?? ".retype";

    if (verbose) {
        core.info(`Outputs ${outputPath}`);
    }

    return;
})().catch(err => {
    core.error(err);
    core.setFailed(err.message);
});


