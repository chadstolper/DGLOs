module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-rollup');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-exec');
	// grunt.loadNpmTasks('grunt-typedoc');
	var nodeResolve = require("rollup-plugin-node-resolve");
	var rollupSourcemaps = require('rollup-plugin-sourcemaps');
	var rollupCommonjs = require('rollup-plugin-commonjs');

	//////////////////    Main File    /////////////////////////
	////////////////////////////////////////////////////////////
	mainfile = 'test.main';
	// mainfile = 'mattTest.main';
	// mainfile = 'willTest';

	// mainfile = 'EgographTest';
	// mainfile = 'mainFD';
	// mainfile = 'LesMiserablesTest';
	// mainfile = 'DemonstrationsMain';
	// mainfile = 'RadoslawTest';

	// mainfile = "mainGestalt";
	// mainfile = 'animatedGraph';
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// jsdoc: {
		// 	dist: {
		// 		src: ['src/ts/**/*.ts', 'README.md', 'package.json'],
		// 		options: {
		// 			destination: 'docs',
		// 			// template: "node_modules/docdash/template",
		// 			configure: "jsdoc.conf.json"
		// 		}
		// 	}
		// },

		// typedoc: {
		// 	build: {
		// 		default: {
		// 			tsconfig: true
		// 		},
		// 		options: {
		// 			// fast: "never",
		// 			module: "umd",
		// 			target: 'es6',
		// 			out: "./docs/",
		// 			// includeDelarations: "true",
		// 			readme: "./README.md",
		// 			mode: "modules"
		// 		},
		// 		// options: {
		// 		// 	module: 'commonjs',
		// 		// 	target: 'es5',
		// 		// 	out: 'docs/',
		// 		// 	name: 'My project title'
		// 		// },
		// 		src: 'src/ts/'
		// 	}
		// },

		exec: {
			gen_docs: 'node_modules/.bin/compodoc -p tsconfig.json --theme readthedocs -d docs'
		},

		rollup: {
			options: {
				sourceMap: true,
				// sourceMapRelative: true,
				cache: 'js/bundle.js',
				format: 'umd',
				moduleName: 'dglos',
				plugins: function () {
					return [
						nodeResolve({
							jsnext: true,
							main: true
						}),
						rollupSourcemaps(),
						rollupCommonjs()
					]
				}
			},
			files: {
				dest: 'js/bundle.js',
				src: 'out/src/ts/main/' + mainfile + '.js'
				// src: 'out/src/ts/' + mainfile + '.js'
			},
		},
		connect: {
			server: {
				options: {
					port: 8080,
					base: './'
				}
			}
		},
		ts: {
			default: {
				tsconfig: true
			},
			options: {
				fast: "never",
				target: 'es6'
			}
		},
		tslint: {
			options: {
				configuration: "tslint.json",
				force: true
			},
			files: {
				src: "src/ts/**/*.ts"
			}

		},
		watch: {
			typescript: {
				files: 'src/**/*.ts',
				tasks: ['compile']
			}
		},
		open: {
			dev: {
				path: 'http://localhost:8080/index.html'
			}
		},
		clean: {
			tscommands: "tscommand-*"

		}
	});
	// grunt.registerTask('build', ['tslint', 'ts', 'clean', 'rollup', 'typedoc']);
	grunt.registerTask('compile', ['tslint', 'ts', 'clean', 'rollup', 'exec:gen_docs']);
	grunt.registerTask('default', ['connect', 'open', 'watch']);
	// grunt.registerTask('default', 'compile');
};