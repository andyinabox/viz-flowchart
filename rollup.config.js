import { terser } from "rollup-plugin-terser";
// import sourcemaps from "rollup-plugin-sourcemaps";

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/viz-flowchart.js',
      format: 'iife',
      sourcemap: true,
    },
    {
      file: 'dist/viz-flowchart.mjs',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [terser()]
};