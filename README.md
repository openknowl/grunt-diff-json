# grunt-diff-json

> Grunt task that compares json files.

This library is to check if two or more json files have same structure. This can be useful when
1. Check config file written as JSON with an example JSON file.
2. Check i18n translated key/value pairs.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-diff-json --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-diff-json');
```

## The "diffJSON" task

### IMPORTANT

`dest` is the template or the original source of the comparison.
`src` is/are the test subject(s) to be compared with the template.

This is due to the nature of grunt - source files can be multiple where destination file are not.

### Options

#### options.report

Select what kind of differences should be reported as an error, warning, etc.

* Type: Object(key/value(string) pair)
* Report kinds (possible keys):
  * typeMismatch: 'error',
  * edited: Value edited (but has a same type)
  * obsolete: Obsolete value in destination.
  * missing: Missing value in destionation.

* Report options (possible values):
  * fatal:   log as an error. Stops task even if called with --force.
  * error:   log as an error. Stops task if called without --force.
  * warn:    log as an error, but continue. 
  * notice:  log only.
  * verbose: log only in verbose mode.
* Default value:
```js
report: {
  typeMismatch: 'error',
  edited:       'notice',
  obsolete:     'warn',
  missing:      'error'
}
```

#### options.parseFunction

Choose what function to use for parsing the JSON file.

* Type: String(enum) - possible values: `JSON.parse`, `eval`
* Default value: `JSON.parse`

`JSON.parse` is useful when the JSON file is and should be strictly formatted.
`eval` is useful when JSON file is loosely formatted, especially when it has comments, etc.
Task fails when JSON file fails to be parsed.

### Usage Examples

```js
grunt.initConfig({
  diffJSON: {
    config: {
      dest: 'config-example.json',
      src: ['config-development.json', 'config-production.json']
    },
    
    i18n: {
      options: {
        report: {
          missing: 'warn', 
          edited: 'verbose'
        },
      },
      dest: 'i18n/dev.json',
      src: ['i18n/en-US.json', 'i18n/ko-KR.json']
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## License

Copyright (c) 2015 openknowl

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.