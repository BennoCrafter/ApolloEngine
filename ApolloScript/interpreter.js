const fs = require('fs');
const Lexer = require('./lexer');
const Parser = require('./parser');
const Evaluator = require('./evaluator');

function main(filename) {
  const path = 'ExampleCodes/';
  const code = fs.readFileSync(path + filename, 'utf-8');

  const lexer = new Lexer();
  const tokens = lexer.tokenize(code);

  const parser = new Parser();
  const ast = parser.parse(tokens);
 //  console.log(ast);

  const evaluator = new Evaluator();
  evaluator.evaluate(ast);
}

const filename = 'example.st';
main(filename);

module.exports = Evaluator;
  