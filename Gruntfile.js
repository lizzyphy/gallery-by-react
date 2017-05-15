'use strict';
var mountFolder = function(connect,dir){
	return connect.static(require('path').resolve(dir));
};

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		webpack:{
			options:webpackDistConfig,
			dist:{
				cache:false
			}
		},
		'webpack-dev-server':{
			options:{
				hot:true,
				port:8000,
				webpack:webpackDevConfig,
				publicPath:'/assets/',
				contentBase:'./<%= pkg.src =%>/'

			},
			start:{
				keepAlive:true
			}
		},

		connect:{
			options:{
				port:8000
			},
			dist:{
				options:{
					keepalive:true,
					middleware:function(connect){
						return[
							mountFolder(connect,pkgConfig.dist)
						];
					}
				}
			}
		}

		open:{
			options:{
				delay:500
			},
			dev:{
				path:'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
			},
			dist:{
				path:'http://localhost:<%= connect.options.port %>/'
			}
		},

		copy:{
			dist:{
				files:[
					{
						flatten:true,
						expand:true,
						src:['<%= pkg.src %>/*'],
						dest:'<%= pkg.dist %>/',
						filter:'isFile'
					},
					{
						flatten:true,
						expand:true,
						src:['<%= pkg.src %>/images/*'],
						dest:'<%= pkg.dist %>/images/',
					}
				]
			}
		},
		clean:{
			dist:{
				files:[{
					dot:true,
					src:[
						'<%= pkg.dist %>'
					]
				}]
			}
		}
	});

	grunt.registerTask('serve',function(target){
		if(target === 'dist'){
			return grunt.task.run(['build','open:dist','connect:dist']);

		}
		grunt.task.run([
				'open:dev',
				'webpack-dev-server'
			]);
	});
	grunt.registerTask('build',['clean','copy','webpack']);
	grunt.registerTask('default',[]);
};