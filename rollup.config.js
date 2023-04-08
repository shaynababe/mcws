import glob from 'glob';
import path from 'node:path';
import vue2 from 'rollup-plugin-vue2';
//import vue from 'rollup-plugin-vue';
import htmlparts from 'rollup-plugin-htmlparts';
import scss from 'rollup-plugin-scss'
import html from '@rollup/plugin-html';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import multi from '@rollup/plugin-multi-entry';
import auto from '@rollup/plugin-auto-install';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';

//import { nodeResolve } from '@rollup/plugin-node-resolve';
import { fileURLToPath } from 'node:url';

export default {
/** rollup.config.js
//import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [resolve()]
};
**/
	input: Object.fromEntries(
	glob.sync('./src/**/*.js').map(file => [
			// This remove `src/` as well as the file extension from each
			// file, so e.g. src/nested/foo.js becomes nested/foo
			path.relative(
				'src',
				file.slice(0, file.length - path.extname(file).length)
			),
			// This expands the relative paths to absolute paths, so e.g.
			// src/nested/foo becomes /project/src/nested/foo.js
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
	output: {
		format: 'esm',
		dir: 'distjs1'

	},
	plugins: [scss(), commonjs(), html(), vue2(), json(), resolve()]
};
