require("esbuild")
  .build({
    entryPoints: ["src/App.jsx"],
    bundle: true,
    sourcemap: process.env !== "prod",
    minify: process.env === "prod",
    outfile: "out.js",
  })
  .catch(() => process.exit(1));
