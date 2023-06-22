const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

esbuild
  .build({
    entryPoints: ["./index.ts"],
    outfile: "./lib/brainhump.js",
    bundle: true,
    minify: true,
    platform: "node",
    sourcemap: true,
    target: "node14",
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
