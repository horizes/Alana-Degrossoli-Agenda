import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const files = [];
async function collect(directory) {
  for (const entry of await readdir(path.join(root, directory), {
    withFileTypes: true,
  })) {
    if (
      entry.name.startsWith(".") ||
      ["scripts", "node_modules"].includes(entry.name)
    )
      continue;
    const name = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) await collect(name);
    else if (name !== "sw.js" && name !== "config.js" && !name.endsWith(".md"))
      files.push(name);
  }
}
await collect("");
files.sort();
const hash = createHash("sha256");
for (const file of files)
  hash.update(file).update(await readFile(path.join(root, file)));
const version = hash.digest("hex").slice(0, 12);
const swPath = path.join(root, "sw.js");
const sw = (await readFile(swPath, "utf8")).replace(
  /VERSION\s*=\s*['"][a-f0-9]+['"]/,
  `VERSION='${version}'`,
);
await writeFile(swPath, sw);
console.log(`Cache Alana Agenda: ${version}`);
