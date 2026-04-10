import { build } from "esbuild";
import { resolve, dirname } from "path";
import { createRequire } from "module";

// Resolve hono's actual location regardless of hoisting layout
const req = createRequire(resolve("packages/api/package.json"));
const honoDir = dirname(req.resolve("hono/package.json"));

await build({
  entryPoints: ["scripts/api-entry.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "api/index.mjs",
  external: ["@libsql/client", "@vercel/og", "react"],
  alias: {
    "hono/vercel": resolve(honoDir, "dist/adapter/vercel/index.js"),
    "hono/cors": resolve(honoDir, "dist/middleware/cors/index.js"),
    "hono": resolve(honoDir, "dist/index.js"),
  },
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});

console.log("API bundled to api/index.mjs");
