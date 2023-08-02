class Parser {
    constructor() {}
  
    parse(tokens) {
      let tokenIndex = 0;
  
      // Helper function to consume a token
      function consume(token_types) {
        if (Array.isArray(token_types)) {
          if (tokens.length > 0 && token_types.includes(tokens[0][0])) {
            return tokens.shift();
          }
        } else if (typeof token_types === 'string') {
          if (tokens.length > 0 && tokens[0][0] === token_types) {
            return tokens.shift();
          }
        }
        throw new SyntaxError(`Expected ${token_types}, but found ${tokens[0][0]}`);
      }
  
      // Grammar rules
      function statement() {
        if (tokens[0][0] === 'VAR') {
          const var_name = consume('VAR')[1];
          consume('ASSIGN');
          const expr_value = expression();
          consume('SEMICOLON');
          return ['assign', var_name, expr_value];
        } else if (tokens[0][0] === 'WRITE') {
          const content = [];
          consume('WRITE');
          while (tokens[0][0] !== 'SEMICOLON') {
            if (tokens[0][0] !== 'ADD_STRING') {
              content.push(tokens[0]);
            }
            consume(['STRING', 'INTEGER', 'ADD_STRING', 'VAR']);
          }
          consume('SEMICOLON');
          return ['write', content];
        } else if (tokens[0][0] === 'FOR') {
          consume('FOR');
          const iteration = consume(['INTEGER', 'VAR']);
          consume('WITH');
          const var_to_iterate = consume('VAR')[1];
          consume('LBRACE');
          const loop_statements = [];
          while (tokens[0][0] !== 'RBRACE') {
            loop_statements.push(statement());
          }
          consume('RBRACE');
          return ['for_loop', iteration, var_to_iterate, loop_statements];
        } else if (tokens[0][0] === 'IF') {
          consume('IF');
          const first_param = consume(['INTEGER', 'STRING', 'VAR']);
          const operator = consume(['EQUAL', 'NOTEQUAL', 'LESS_THAN', 'GREATER_THAN'])[0];
          const second_param = consume(['INTEGER', 'STRING', 'VAR']);
          consume('LBRACE');
          const if_statements = [];
          while (tokens[0][0] !== 'RBRACE') {
            if_statements.push(statement());
          }
          consume('RBRACE');
          return ['if_statement', [operator, [first_param, second_param]], if_statements];
        } else if (tokens[0][0] === 'INPUT') {
          consume('INPUT');
          const s = consume('STRING')[1];
          return ['input', s];
        } else {
          throw new SyntaxError(`Unexpected token: ${tokens[0][0]}`);
        }
      }
  
      function expression() {
        let term_value = term();
        while (tokens.length > 0 && ['PLUS', 'MINUS'].includes(tokens[0][0])) {
          const operator = tokens[0][0];
          consume(operator);
          const term_value2 = term();
          term_value = ['binop', operator, term_value, term_value2];
        }
        return term_value;
      }
  
      function term() {
        let factor_value = factor();
        while (tokens.length > 0 && ['TIMES', 'DIVIDE'].includes(tokens[0][0])) {
          const operator = tokens[0][0];
          consume(operator);
          const factor_value2 = factor();
          factor_value = ['binop', operator, factor_value, factor_value2];
        }
        return factor_value;
      }
  
      function factor() {
        if (tokens[0][0] === 'INTEGER') {
          return ['INTEGER', parseInt(consume('INTEGER')[1])];
        } else if (tokens[0][0] === 'STRING') {
          return ['STRING', String(consume('STRING')[1])];
        } else if (tokens[0][0] === 'VAR') {
          return ['VAR', consume('VAR')[1]];
        } else if (tokens[0][0] === 'INPUT') {
          consume('INPUT');
          const s = consume('STRING')[1];
          return ['input', s];
        } else {
          throw new SyntaxError(`Unexpected token: ${tokens[0][0]}`);
        }
      }
  
      // Start parsing
      const ast = [];
      while (tokens.length > 0) {
        ast.push(statement());
      }
      return ast;
    }
  }
  module.exports = Parser;  