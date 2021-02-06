import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import sourcemaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

export default {
	input: './src/index.ts',
	output: [
		{
			sourcemap: true,
			file: 'build/debug/index.js',
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
		sourcemaps(),
	],
};
