import path from 'path';
import fs from 'fs';

import { Plugin } from "vite";
import { ResolvedConfig } from "vite";
import { getFiles } from "./file-helpers";

export default function copyFiles(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'copyFiles',
    enforce: "post",
    configResolved(_config) {
      config = _config
    },
    generateBundle: {
      async handler() {
        const root = config.root;

        const projectConfigPlainText = fs.readFileSync(__dirname + "./../src/project.config.json", 'utf8');
        const projectConfig = JSON.parse(projectConfigPlainText);

        if (projectConfig.copy && Array.isArray(projectConfig.copy)) {
          const paths = projectConfig.copy;

          paths.forEach(currentPath => {
            const sourceDirectory = path.normalize(path.join(root, currentPath.src));

            // use rollup plugin API
            var rollup = this;

            let files = getFiles(sourceDirectory, currentPath.filter);
            files.forEach(function (file) {
              let fullSourceFileName = file.absolute;
              let fullTargetFileName = currentPath.dest + "/" + file.import.substring(1); // remove leading slash

              // compile file
              config.logger.info(`Copying file "${fullSourceFileName}" to "${fullTargetFileName}"`);

              // add to build result
              rollup.emitFile({
                type: 'asset',
                fileName: fullTargetFileName,
                source: fs.readFileSync(fullSourceFileName)
              });
            });
          });
        }
      }
    }
  }
}
