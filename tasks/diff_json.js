/*
 * grunt-diff-json
 * https://github.com/openknowl/grunt-diff-json
 *
 * Copyright (c) 2015 openknowl
 * Licensed under the MIT license.
 */

'use strict';

var deepDiff = require('deep-diff');

var diffJSON = function (template, subject) {
	var differences = deepDiff(template, subject);
	var report = [];

	var kindDict = {
		T: 'typeMismatch',
		E: 'edited',
		N: 'obsolete',
		D: 'missing'
	};

	// Handle empty.
	if (!(differences instanceof Array) || differences.length === 0) {
		return report;
	}

	// Reformat this data.
	differences.forEach(function (diff) {
		var path = '[' + diff.path.join('.') + ']';

		if (diff.kind === 'A') {
			path += '[' + diff.index + ']';
			diff = diff.item;
		}

		var kind = kindDict[diff.kind];
		// Override type for convenience.
		if (kind === 'edited' && (typeof diff.rhs) !== (typeof diff.lhs)) {
			kind = 'typeMismatch';
		}
		
		// Format string.
		var msg = (function () {
			switch (kind) {
				case 'typeMismatch': 
					return 'Mismatching type: ' + '"' + (typeof diff.lhs) + '" -> "' + (typeof diff.rhs) + '"';
				case 'edited':
					return JSON.stringify(diff.lhs) + ' -> ' + JSON.stringify(diff.rhs);
				case 'obsolete':
					return 'Obsolete: ' + '(current value: ' + JSON.stringify(diff.rhs) + ')';
				case 'missing':
					return 'Missing: ' + '(example value : ' + JSON.stringify(diff.lhs) + ')';
			}
		})();
		
		// Aggregate to report array.
		report.push({
			kind: kind,
			path: path,
			msg: msg
		});
	});
	
	return report;
};

module.exports = function (grunt) {
	grunt.registerMultiTask('diffJSON', 'Grunt task that compares json files.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			/**
			 * Report options:
			 * fatal:   log as an error. Stops task even if called with --force.
			 * error:   log as an error. Stops task if called without --force.
			 * warn:    log as an error, but continue. 
			 * notice:  log only.
			 * verbose: log only in verbose mode.
			 */
			report: {
				typeMismatch:	'error',	// Mismatching Type
				edited:			'notice',	// Value edited (but has a same type)
				obsolete:		'warn',		// Obsolete value in destination.
				missing:		'error'		// Missing value in destionation.
			},
			
			parseFunction: 'JSON.parse'
		});
		
		var warnings = 0;
		
		var safeReadJSON = function (filepath) {
			try {
				switch (options.parseFunction) {
					case 'eval':
						var raw = grunt.file.read(filepath);
						return eval('(' + raw + ')');
					case 'JSON.parse':
					default:
						return grunt.file.readJSON(filepath);
				}
			}
			catch (err) {
				grunt.fail.fatal(err);
			}
		};
		
		// Iterate over all specified file groups.
		this.files.forEach(function (group) {
			if (!grunt.file.exists(group.dest)) {
				// Destination path is required.
				grunt.fail.warn('Template file "' + group.dest + '" not found.');
				return;
			}

			var template = safeReadJSON(group.dest);

			group.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				}
				else {
					return true;
				}
			})
			.map(function (filepath) {
				var subject = safeReadJSON(filepath);
				grunt.log.writeln('Comparing file: ' + group.dest + ' -> ' + filepath);

				var diffReport = diffJSON(template, subject);
				
				// Report diffs based on type and corresponding option.
				diffReport.forEach(function (line) {
					var str = line.path + ' ' + line.msg;
					switch (options.report[line.kind]) {
						case 'fatal':
							grunt.log.error(str).error('Fatal error. Aborting test...');
							grunt.fail.fatal('Diff test failed.');
							break;
						case 'error':
							grunt.log.error(str).error('Aborting test...');
							grunt.fail.warn('Diff test failed.');
							break;
						case 'warn':
							grunt.log.error(str);
							warnings += 1;
							break;
						case 'notice':
							grunt.log.ok(str);
							break;
						case 'verbose':
							grunt.log.verbose.ok(str);
							break;
					}
				});
			});
		});

		grunt.log.subhead('Diff test of "' + this.target + '" succeeded with ' + warnings + ' warning(s).');
	});

};
