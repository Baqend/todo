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
          base: '.',
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
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/all.min.js': ['libs/js/jquery.min.js', 'libs/js/*.js', 'app.js']
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


  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('dist', [
    'clean:dist',
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
    'connect',
    'watch'
  ]);


};
