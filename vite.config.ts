import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

import copyFiles from "./.build/copy-files";
import dynamicImports from "./.build/dynamic-imports";
import sassCompile from "./.build/sass-compile";
import mjmlCompile from "./.build/mjml-compile";

// https://vitejs.dev/config/
export default defineConfig({
    root: `./src/`,
    base: `/src/vite/`,
    envDir: `../.env/`,
    build: {
        assetsDir: `./`,
        outDir: `./../dist/`,
        emptyOutDir: true,
        rollupOptions: {
            /*output: {
                assetFileNames: (assetInfo) => {
                    let suffixIndex = assetInfo.name.lastIndexOf('.');
                    let name = assetInfo.name.substring(0, suffixIndex);
                    return `${name}[extname]`;
                },
                chunkFileNames: (chunkInfo) => {
                    return `[name].js`
                },
                entryFileNames: (chunkInfo) => {
                    return '[name].js'
                }
            },*/
        },
    },
    plugins: [
        dynamicImports(),
        react(),
        sassCompile(),
        copyFiles(),
        mjmlCompile(),
        eslint({
            fix: true,
            cache: true,
            include: ['**/*.ts', '**/*.tsx'],
        }),
    ],
    css: {
        devSourcemap: true,
    },
});
