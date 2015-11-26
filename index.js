var through = require('through2');
var File = require('vinyl');
var Path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

var fileContents = {}

var evaluateContents = function(data){
	// With assistance from http://stackoverflow.com/a/21711130

	var output = {};
    
	var expression = /\$(.*?):[\s]?(.*)/g;

	var getKeyValue = function(match, key, value) { 
		output[key] = value;
	};
	
	data.replace(expression, getKeyValue);

	if (Object.keys(output).length < 1) return false;
	
	return output

};

module.exports = function (options) {
	
	var options = options || {}
	if (!options.outputName) options.outputName = 'toolkit';

	var processEach = function(file, encoding, cb){

		if (file.isNull()) {
			cb(null, file);
			return;
		};

		if (file.isStream()) {
			cb(new gutil.PluginError('sass-json', 'Streaming not supported'));
			return;
		};

		// Process the file against the REGEX that looks for variables.
		var contents = evaluateContents(file.contents.toString('utf8'));
		
		// Return if there are no variables
		if (!contents) { return cb(); };

		// Clean up the name, removing any underscores that SASS partials have.
		var name = Path.basename(file.path, Path.extname(file.path)).replace(/(_)/g, '');

		// Add contents to the file list
		fileContents[name] = contents;

		cb();

	};

	var output = function(cb){

		var outputFile = new File({
			base : 'temp/',
			path : 'temp/temp.json',
		});

		outputFile.basename = options.outputName + '.json';
		outputFile.contents = new Buffer(JSON.stringify(fileContents));
		
		this.push(outputFile);
		
		cb();

	}

	return through.obj(processEach, output);

};