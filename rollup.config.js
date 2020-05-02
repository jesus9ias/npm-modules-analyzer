const rollup = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const filesize = require('rollup-plugin-filesize');

const builder = plugins => rollup.rollup({
  input: 'src/index.js',
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser()
  ].concat(plugins || [], filesize())
});

builder()
  .then((bundle) => {
    bundle.write({
      format: 'umd',
      file: './dist/index.js',
      name: 'npm-modules-analyzer',
      sourcemap: false
    });
  });
