/*global module:true */


module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    connect: {
      server: {
        options: {
          hostname: '*',
          port: 8050,
          open: 'http://127.0.0.1:8050/index.html',
          base: ['.tmp','.'],
          livereload: true
        }
      }
    },

    watch: {
      options: {
        forever: true,
        livereload: true
      },
      css: {
        files: ['*'],
        tasks: []
      },
      js : {
        files: ['app.js'],
        tasks: ['babel:dev']
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'dist/app.js': 'app.js'
        }
      },
      dev: {
        files: {
          '.tmp/app.js': 'app.js'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/all.min.js': ['libs/js/jquery.min.js', 'libs/js/*.js', 'dist/app.js']
        }
      }
    },

    processhtml: {
      options: {
        "strip": true
      },

      dist: {
        files: {
          'dist/index.html': ['index.html']
        }
      },
      iframe: {
        files: {
          'dist/iframe.html': ['index.html']
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/all.min.css': ['libs/css/*.css', 'style.css']
        }
      }
    },

    copy: {
      dist: {
        files: [
          { expand: true, cwd: 'libs/css/fonts', src: ['**'], dest: 'dist/fonts/' }
        ]
      }
    },

    clean: {
      dist: ['dist']
    }

  });

require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks


  grunt.registerTask('dist', [
    'clean:dist',
    'babel:dist',
    'uglify:dist',
    'cssmin:dist',
    'processhtml:dist',
    'copy:dist'
  ]);

  grunt.registerTask('iframe', [
    'dist', 
    'processhtml:iframe'
  ]);

  grunt.registerTask('default', [
    'babel:dev',
    'connect',
    'watch'
  ]);


};
