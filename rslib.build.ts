import { defineBuildConfig } from "@workleap/rslib-configs";
import builtinModulesList from "builtin-modules";
import path from "node:path";

const builtinModules = new Set(builtinModulesList);

export default defineBuildConfig({
    bundle: true,
    entry: {
        index: "./src/index.ts"
    },
    tsconfigPath: path.resolve("./tsconfig.build.json"),
    target: "node",
    dts: false,
    sourceMap: false,
    transformers: [
        config => {
            config.output = {
                ...config.output,
                externals(data, callback) {
                    callback(undefined, builtinModules.has(data.request!));
                }
            };

            config.performance = {
                ...config.performance,
                chunkSplit: {
                    ...config.performance?.chunkSplit,
                    strategy: "all-in-one"
                }
            };

            return config;
        }
    ]
});
