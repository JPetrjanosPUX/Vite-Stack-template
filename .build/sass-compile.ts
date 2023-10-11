import fs from 'fs';
import path from 'path';
import sass, { compile } from 'sass'

import { Plugin } from "vite";
import { ResolvedConfig } from "vite";
import { getFiles } from "./file-helpers";

export default function sassCompile(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'sassCompile',
    enforce: "post",
    configResolved(_config) {
      config = _config
    },
    generateBundle: {
      async handler() {
        const root = config.root;

        const sourceDirectory = path.normalize(root);

        config.logger.info(`Compiling Sass files from ${sourceDirectory}`);

        // use rollup plugin API
        var rollup = this;

        let files = getFiles(sourceDirectory, "\.bundle\.scss");
        files.forEach(function (file) {
          // let fullSourceFileName = path.join(sourceDirectory, file);
          // let fullTargetFileName = path.normalize(fullSourceFileName).replace(sourceDirectory, "").substring(1).replace('\\', '/') + ".css";

          let fullSourceFileName = file.absolute;
          let fullTargetFileName = file.import.replace(".scss", ".css").substring(1); // remove leading slash

          // compile file
          config.logger.info(`Sass compiling file "${fullSourceFileName}" to "${fullTargetFileName}"`);
          let compiled = sass.compile(fullSourceFileName, { style: 'compressed' });

          // add to build result
          rollup.emitFile({
            type: 'asset',
            name: fullTargetFileName,
            source: compiled.css
          });
        });
      }
		},
  }
}
