/*!
 * jshtml by Elmer Bulthuis <elmerbulthuis@gmail.com>
 */

var Parser = require('./lib/jshtml/Parser');

exports.Parser = Parser;
exports.parse = parse;

function parse(source, options){
	var result;
	var parser;

	result = '';
	parser = new Parser(function(data) {
		result += data;
	}, options);
	parser.end(source);

	return result;
}//parse
