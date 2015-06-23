/*
 * grunt-diff-json
 * https://github.com/openknowl/grunt-diff-json
 *
 * Copyright (c) 2015 openknowl
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run (and then tested).
    diffJSON: {
      success: {
        dest: 'test/json/template.json',
        src: 'test/json/success.json',
      },
      warn: {
        options: {
          report: {
            typeMismatch: 'warn',
            edited: 'notice',
            oboslete: 'warn',
            missing: 'error'
          },
          parseFunction: 'eval'
        },
        dest: 'test/json/template.json',
        src: 'test/json/warn.json',
      },
      error: {
        dest: 'test/json/template.json',
        src: 'test/json/error.json',
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'diffJSON:success',
    'diffJSON:warn',
    'diffJSON:error',
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
