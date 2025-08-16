import { defineBuildConfig } from "@workleap/rslib-configs";
import path from "node:path";

export default defineBuildConfig({
    bundle: true,
    entry: {
        index: "./src/index.ts"
    },
    tsconfigPath: path.resolve("./tsconfig.build.json"),
    target: "node",
    dts: false,
    sourceMap: false
});
