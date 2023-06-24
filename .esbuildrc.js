import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outfile: "lib/index.js",
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node14",
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
