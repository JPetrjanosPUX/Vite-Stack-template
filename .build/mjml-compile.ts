import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml'

import { Plugin } from "vite";
import { ResolvedConfig } from "vite";
import { getFiles } from "./file-helpers";

export default function mjmlCompile(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'mjmlCompile',
    enforce: "post",
    configResolved(_config) {
      config = _config
    },
    generateBundle: {
      async handler() {
        const root = config.root;
        const sourceDirectory = path.normalize(root);
        const mjmlTitleMacro = '###TITLE###';

        config.logger.info(`Compiling MJML files from ${sourceDirectory}`);

        // use rollup plugin API
        var rollup = this;

        let files = getFiles(sourceDirectory, "\.mjml$");
        files.forEach(function (file) {
          // let fullSourceFileName = path.join(sourceDirectory, file);
          // let fullTargetFileName = path.normalize(fullSourceFileName).replace(sourceDirectory, "").substring(1).replace('\\', '/') + ".css";

          let fileName = path.basename(file.absolute);
          let fullSourceFileName = file.absolute;
          let fullTargetFileName = file.import.replace(".mjml", ".html").substring(1); // remove leading slash

          if (fileName.startsWith('_')) {
            // skip partial files starting with an underscore
            config.logger.info(`Mjml skipping "${fullSourceFileName}"`);
            return;
          }

          let sourceFileContent = fs.readFileSync(fullSourceFileName, { encoding: "utf-8" });

          // compile file
          config.logger.info(`Mjml compiling file "${fullSourceFileName}" to "${fullTargetFileName}"`);
          let compiled = mjml2html(
            sourceFileContent,
            {
              // https://documentation.mjml.io/#inside-node-js
              filePath: fullSourceFileName,
              keepComments: true,
              beautify: false,
              minify: false,
              validationLevel: 'soft', // 'strict', 'soft', 'skip'
            });

          compiled.html = compiled.html.replace(mjmlTitleMacro, '{%GetResourceString("Emails.' + fileName.replace('.mjml', '').replace('Text', '') + '.HeaderTitle", Culture)%}');

          config.logger.info(fullTargetFileName)
          // add to build result
          rollup.emitFile({
            type: 'asset',
            name: fullTargetFileName,
            source: compiled.html,
            fileName: fullTargetFileName
          });
        });
      }
    },
  }
}
