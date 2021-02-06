import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
	input: './src/index.ts',
	output: [
		{
			file: 'build/prod/index.js',
			format: 'cjs',
		},
	],
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
	plugins: [
		typescript({
			typescript: require('typescript'),
			useTsconfigDeclarationDir: true,
		}),
		json(),
		terser(),
	],
};
