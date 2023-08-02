class Lexer {
    constructor() {
      // Define token types
      this.token_specification = [
        ['INTEGER', /\d+/],
        ['STRING', /"[^"]*"/],
        ['FOR', /for/],
        ['WITH', /with/],
        ['IF', /if/],
        ['EQUAL', /==/],
        ['NOTEQUAL', /!==/],
        ['GREATER_THAN', />/],
        ['LESS_THAN', /</],
        ['FLOAT', /\d+\.\d+/],
        ['WRITE', /write/],
        ['INPUT', /input/],
        ['ADD_STRING', /,/],
        ['VAR', /[a-zA-Z][a-zA-Z0-9]*/],
        ['ASSIGN', /=/],
        ['SEMICOLON', /;/],
        ['PLUS', /\+/],
        ['MINUS', /-/],
        ['TIMES', /\*/],
        ['DIVIDE', /\//],
        ['LBRACE', /{/],
        ['RBRACE', /}/],
      ];
      this.token_regex = this.token_specification.map(pair => `(?<${pair[0]}>${pair[1].source})`).join('|');
    }
  
    tokenize(code) {
      const tokens = [];
      const regex = new RegExp(this.token_regex, 'g');
      let match;
      while ((match = regex.exec(code)) !== null) {
        for (const [index, name] of Object.keys(match.groups).entries()) {
          if (match[index + 1] !== undefined) {
            tokens.push([name, match[index + 1]]);
            break;
          }
        }
      }
      return tokens;
    }
  }
  
  module.exports = Lexer;