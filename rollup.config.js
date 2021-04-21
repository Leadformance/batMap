import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sass from 'rollup-plugin-sass';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const ENTRIES = ['gmaps', 'gmaps-widget', 'leaflet', 'mappy', 'mappy-widget'];

const OUTPUT_FORMAT = 'cjs';

const PLUGINS = [
  resolve({
    preferBuiltins: true,
  }),
  commonjs(),
  typescript({
    tsconfig: 'tsconfig.json',
  }),
  sass(),
  babel({
    babelHelpers: 'bundled',
    extensions: [...DEFAULT_EXTENSIONS, '.ts'],
  }),
];

export default [
  {
    input: pkg.source,
    output: {
      file: pkg.main,
      format: OUTPUT_FORMAT,
      exports: 'named',
    },
    plugins: PLUGINS,
  },
  ...ENTRIES.map(entry => ({
    input: `src/providers/${entry}/index.ts`,
    output: {
      file: `dist/${entry}.js`,
      format: OUTPUT_FORMAT,
      exports: 'named',
    },
    plugins: PLUGINS,
  })),
];
