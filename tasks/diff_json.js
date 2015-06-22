/*
 * grunt-diff-json
 * https://github.com/openknowl/grunt-diff-json
 *
 * Copyright (c) 2015 openknowl
 * Licensed under the MIT license.
 */

'use strict';

var deepDiff = require('deep-diff');

var diffJson = function (dest, src) {
	var diff = deepDiff(src, dest);

	if (typeof diff !== 'undefined') {
		for (var i = 0; i < diff.length; i++) {
			var path = diff[i].path.join('.');
			switch (diff[i].kind) {
				case 'E':
					if (typeof diff[i].rhs !== typeof diff[i].lhs) {
						grunt.log.error('Wrong Type [' + path + ']');
						grunt.fail.warn('config test failed.');
					}

					else {
						grunt.log.writeln('[' + path + '] "' + diff[i].lhs + '" -> "' + diff[i].rhs + '"');
					}

					break;

				case 'N':
					grunt.log.error('Obsolete [' + path + ']');
					warn++;
					break;

				case 'D':
					grunt.log.error('Missing [' + path + '] (example value : "' + diff[i].lhs + '") Aborting.');
					grunt.fail.warn('config test failed.');
					break;
			}
		}
	}

	grunt.log.writeln('Config test succeeded with ' + warn + ' warning(s).');
	return true;
};

module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('diff_json', 'Grunt task that compares two json files.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			punctuation: '.',
			separator: ', '
		});

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			// Concat specified files.
			var src = f.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
				// Read file source.
				return grunt.file.read(filepath);
			}).join(grunt.util.normalizelf(options.separator));

			// Handle options.
			src += options.punctuation;

			// Write the destination file.
			grunt.file.write(f.dest, src);

			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
		});
	});

};