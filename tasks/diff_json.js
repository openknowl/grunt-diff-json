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
	var differences = deepDiff(src, dest);
	var report = [];

	// Reformat this data.
	differences.forEach(function (diff) {
		// Override type for convenience.
		if ((typeof diff.rhs) !== (typeof diff.lhs)) {
			diff.kind = 'T';
		}
		
		var path = '[' + diff.path.join('.') + ']';
		var msg;
		
		// Format string.
		switch (diff.kind) {
			case 'E':
				msg = '"' + diff.lhs + '" -> "' + diff.rhs + '"';
				break;
			case 'T': 
				msg = 'Mismatching type: ' + '"' + (typeof diff.lhs) + '" -> "' + (typeof diff.rhs) + '"';
				break;
			case 'N':
				msg = 'Obsolete: ' + '(current value: "' + diff.rhs + '")';
				break;
			case 'D':
				msg = 'Missing: ' + '(example value : "' + diff[i].lhs + '")';
				break;
		}
		
		// Aggregate to report array.
		report.push({
			kind: diff.kind,
			path: path,
			msg: msg
		});
	});
	
	return report;
};

module.exports = function (grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('diff_json', 'Grunt task that compares two json files.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			report: {
				T: 'error',
				E: 'notice',
				N: 'warn',
				D: 'error'
			}
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