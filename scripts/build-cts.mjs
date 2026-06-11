// Produce a CommonJS declaration alongside the ESM one.
//
// The UMD build (index.umd.cjs) does `module.exports = ARIATabManager`, so
// `require("@wezz/ariatabmanager")` returns the class directly. The ESM
// declaration uses `export default`, which mistypes that for CJS consumers
// under node16 (attw: FalseExportDefault / FalseESM). We derive a CJS
// declaration (`export =`) that matches the runtime shape and wire it to the
// "require" condition in package.json `exports`. (We do not target node10 —
// the package requires Node >= 18.)
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const dtsPath = resolve(distDir, "index.d.ts");

// vite-plugin-dts writes declarations asynchronously, so the file may not be on
// disk the instant `vite build` returns. Poll briefly for it.
const sleep = (ms) =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
let waited = 0;
while ((!existsSync(dtsPath) || statSync(dtsPath).size === 0) && waited < 10000) {
  sleep(100);
  waited += 100;
}
if (!existsSync(dtsPath)) {
  throw new Error(`Timed out waiting for ${dtsPath} to be generated`);
}

// Derive the CJS declaration: drop the ESM default export and the empty
// `export { }` marker (both conflict with `export =`) and append `export =`.
const cjs =
  readFileSync(dtsPath, "utf8")
    .replace(/^export default ARIATabManager;\s*$/m, "")
    .replace(/^export\s*\{\s*\};?\s*$/m, "")
    .trimEnd() + "\nexport = ARIATabManager;\n";
writeFileSync(resolve(distDir, "index.d.cts"), cjs);

console.log("Wrote dist/index.d.cts");
