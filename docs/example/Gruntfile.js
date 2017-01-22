'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-jst-redux');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jst: {
            compile: {
                options: {
                    cjs: true,
                    nolodash: true,
                    templateSettings: {
                        variable: 'data'
                    }
                },
                files: {
                    'src/templates/index.js': ['templates/*.html']
                }
            }
        },
        eslint: {
            src: ['*.js']
        },
        browserify: {
            dist: {
                files: {
                    'todomvc.bundle.js': ['./src/index.js']
                }
            }
        }
    });

    grunt.registerTask('default', ['jst', 'browserify']);
};