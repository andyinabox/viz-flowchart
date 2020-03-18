import { terser } from "rollup-plugin-terser";

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/viz-flowchart.js',
      format: 'iife',
      sourcemap: true,
    },
    {
      file: 'dist/viz-flowchart.module.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [terser()]
};