import * as core from "@actions/core";
import fs from "node:fs";
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

    const config = await readRetypeConfig(resolvedConfigPath);

    if (verbose) {
        core.info(`Config Detected at ${resolvedConfigPath}: ${JSON.stringify(config)}`);
    }

    const mdxFilesLocations = path.resolve(config.input ?? ".");

    if (verbose) {
        core.info(`Trying to resolve input folder: ${mdxFilesLocations}`);
    }

    const allDocsRootPaths = fs.readdirSync(mdxFilesLocations, { encoding: "utf8", withFileTypes: true });
    const test = allDocsRootPaths.map(dirent => {
        const isDir = dirent.isDirectory();
        const name = dirent.name;
        const fullPath = path.join(dirent.parentPath, name);

        let directoryInformationFile = "";
        if (isDir) {
            // Look for either index.md or index.yml
            const indexMd = path.join(fullPath, "index.md");
            const indexYml = path.join(fullPath, "index.yml");
            if (fs.existsSync(indexMd)) {
                directoryInformationFile = indexMd;
            } else if (fs.existsSync(indexYml)) {
                directoryInformationFile = indexYml;
            }
        }

        let isIgnored = false;
        if (path.extname(name) !== ".md" && path.extname(name) !== ".yml") {
            isIgnored = true;
        }

        return {
            isDirectory: isDir,
            name,
            fullPath: fullPath,
            directoryInformationFile,
            isIgnored
        };
    });
    // const mdxFiles = readDirRecursiveSync(mdxFilesLocations);

    if (verbose) {
        core.info(`Files to process: ${JSON.stringify(test)}`);
    }


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

    const outputPath = output ?? config.output ?? ".retype";

    if (verbose) {
        core.info(`Output path: ${outputPath}`);
    }

    // writing content
    const filesToConvert = test.filter(f => !f.isIgnored).filter(f => !f.isDirectory).filter(x => path.extname(x.name) === ".md").map(x => {
        const ext = path.extname(x.name);
        const nameWithoutExt = path.basename(x.name, ext);

        return {
            input: x.fullPath,
            // /about.md becomes /about/index.txt
            output: path.join(outputPath, nameWithoutExt, "index.txt")
        };
    });

    if (verbose) {
        core.info(`Files to convert: ${JSON.stringify(filesToConvert)}`);
    }

    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.promises.writeFile(path.join(outputPath, "llms.txt"), llmsBuilder.build());
    await fs.promises.writeFile(path.join(outputPath, "llms-full.txt"), llmsBuilder.buildFull());

    core.info("Retype build LLMs files completed successfully");

    return;
})().catch(err => {
    core.error(err);
    core.setFailed(err.message);
});


