import fs from 'fs';
import path from 'path';

/**
 * Recursively loads file names from a specified directory and its subdirectories.
 *
 * @param {string} directory Path on the filesystem which should be analyzed
 * @param {string} filter File name filter (regex) to filter out file names
 * @param {string} base Base/root path on the filesystem. Result will be relative paths according to this path. Must be same directory or parent directory of "directory" parameter.
 * @returns {string[]} List of found files in the directory (and subdirectories) matching the filter condition.
 */
export function getFiles(directory, filter, base = null): FilePath[] {
  if (!base) {
    base = directory;
  }

  let files: FilePath[] = [];
  fs.readdirSync(directory).forEach(file => {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      // for directories use recursive call
      files.push(...getFiles(absolute, filter, base));

    } else {
      let x = path.normalize(base);
      let relativePath = absolute.substring(x.length);

      // check filter on the relative path
      if (!filter || relativePath.match(new RegExp(filter))) {
        files.push({
          absolute: absolute,
          relative: relativePath.substring(1), // remove leading slash
          import: relativePath.replace(/\\/g, "/") // replace backslashes to forward slashes
        });
      }
    }
  });

  return files;
}

export type FilePath = {
  absolute: string; // absolute path, on Windows e.g. C:\www\project\data.tsx
  relative: string; // relative path according to specified base path, e.g. on Windows "project\data.tsx"
  import: string; // relative path for node.js import statement import("/project/data");
}
