import path from 'path';
import { Plugin, ResolvedConfig } from "vite";
import { getFiles } from "./file-helpers";

export default function dynamicImports(): Plugin {
  const virtualModuleId = 'virtual:dynamic-imports'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  let config: ResolvedConfig;

  return {
    name: 'virtual:dynamic-imports',
    configResolved(_config) {
      config = _config
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const root = config.root;

        // get all bundle files in .ts/.tsx files inside "modules" directory
        const files = getFiles(path.join(root, "modules"), "\.bundle\.ts(x?)");

        let data: { relativePath: string, absolutePath: string }[] = [];
        files.forEach(file => data.push({
          absolutePath: file.absolute.replace(".tsx", "").replace(".ts", "").replace(/\\/g, "/"),
          relativePath: './modules' + file.import.replace(".tsx", "").replace(".ts", "")
        }));

        const result = `
        export function loader(module) {
          ${data.map(x => `if (module == "${x.relativePath}") { return import("${x.absolutePath}"); }`).join("\n")}
          throw new Error("Module '" + module + "' not found, can not import.");
        };`

        return result;
      }
    }
  }
}
