var name = "ksgo_master";
var version = "1.0.0";
var main = "build/debug/index.js";
var module = "build/debug/index.es.js";
var files = [
	"dist"
];
var scripts = {
	build: "rollup --config rollup.config.prod.js",
	dev: "rollup -w --config rollup.config.dev.js"
};
var types = "dist/index.d.ts";
var repository = "https://github.com/Jonster5/ksgo-server-master.git";
var author = "Jonster5 <onlyaccelerating@gmail.com>";
var license = "GPL-3.0";
var devDependencies = {
	"@rollup/plugin-json": "^4.1.0",
	rollup: "^2.38.4",
	"rollup-plugin-sourcemaps": "^0.6.3",
	"rollup-plugin-terser": "^7.0.2",
	"rollup-plugin-typescript2": "^0.29.0",
	typescript: "^4.1.3"
};
var pkg = {
	name: name,
	version: version,
	main: main,
	module: module,
	files: files,
	scripts: scripts,
	types: types,
	repository: repository,
	author: author,
	license: license,
	devDependencies: devDependencies
};

console.log(pkg.main);
