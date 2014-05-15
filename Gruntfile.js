'use strict';

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'bin/**', 'lib/**/*.js']
        },

        watch: {
            src: {
                files: ['Gruntfile.js', 'bin/**', 'lib/**/*.js'],
                tasks: ['jshint']
            }
        }
    });

    grunt.registerTask('default', ['jshint']);
};