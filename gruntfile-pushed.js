module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-rollup');
	var nodeResolve = require("rollup-plugin-node-resolve")
 
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		rollup: {
			options: {
				sourceMap: true,
				// sourceMapRelative: true,
				cache: 'js/bundle.js',
				format: 'umd',
				plugins: function(){
					return [
						nodeResolve({ jsnext: true, main: true })
					]
				}
			},
			files: {
				dest: 'js/bundle.js',
				src: 'out/src/ts/main.js',
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
				tsconfig: true,
			},
			options: {
				//fast: "never"
			}
		},
		tslint: {
			options: {
				configuration: "tslint.json",
				force: false
			},
			files: {
				src: "src/ts/**/*.ts"
			}
			
		},
		watch: {
			typescript: {
				files: 'src/**/*.ts',
				tasks: ['tslint','ts','rollup']
			}
		},
		open: {
			dev: {
				path: 'http://localhost:8080/index.html'
			}
		}
	});
	
	grunt.registerTask('compile', ['ts','rollup']);
	grunt.registerTask('default', ['connect', 'open', 'watch']);
	// grunt.registerTask('default', 'compile');
};