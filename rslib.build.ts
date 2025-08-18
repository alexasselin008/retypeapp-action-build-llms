import { defineConfig } from "@rslib/core";

export default defineConfig({
    source: {
        entry: { index: "./src/index.ts" }
    },
    output: {
        distPath: { root: "./dist" },
        sourceMap: false,
        legalComments: "none"
    },
    lib: [
        {
            format: "cjs",
            autoExternal: false, // bundle all deps
            dts: false,
            output: {
                filename: { js: "index.js" }
            }
        }
    ]
});
