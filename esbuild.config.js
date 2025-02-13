const path = require('path');
const svgrPlugin = require('esbuild-plugin-svgr');
const sassPlugin = require('esbuild-sass-plugin');

require("esbuild").build({
    entryPoints: ["application.js"],
    bundle: true,
    sourcemap: true,
    outdir: path.join(process.cwd(), "app/assets/builds"),
    absWorkingDir: path.join(process.cwd(), "app/javascript"),
    publicPath: 'app/assets',
    watch: process.argv.includes("--watch"),
    loader: {
        '.js': 'jsx', // You might already have this configuration for handling JSX files
        '.jpg': 'file', // Add this line to handle .jpg files
        '.png': 'file', // Add this line to handle .png files
        '.svg': 'file', // Add this line to handle .svg files
    },
    plugins: [svgrPlugin(), sassPlugin.default({type: "style"})],
}).catch(() => process.exit(1));
