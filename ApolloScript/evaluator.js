const { Readline } = require("readline/promises");

class Evaluator {
    constructor() {}
  
    evaluate(ast) {
      const variables = {};
  
      function visit(node) {
        if (node[0] === 'assign') {
          const var_name = node[1];
          const expr = node[2];
          variables[var_name] = [evaluateExpression(expr), node[2][0]];
        } else if (node[0] === 'write') {
          let content = '';
          for (const stat of node[1]) {
            if (stat[0] === 'STRING' || stat[0] === 'INTEGER') {
              content += stat[1].replace(/"/g, '') + ' ';
            } else if (stat[0] === 'VAR') {
              const var_name = stat[1];
              if (var_name in variables) {
                content += `${variables[var_name][0]} `;
              } else {
                throw new Error(`Variable '${var_name}' is not defined.`);
              }
            }
          }
          console.log(content);
        } else if (node[0] === 'for_loop') {
          variables[node[2]] = [1, 'INTEGER'];
          const commands = node[3];
          const iteration = node[1][0] === 'INTEGER' ? node[1][1] : variables[node[1][1]][0];
          for (let i = 0; i < parseInt(iteration); i++) {
            for (const element of commands) {
              visit(element);
            }
            variables[node[2]] = [variables[node[2]][0] + 1, variables[node[2]][1]];
          }
        } else if (node[0] === 'if_statement') {
          const condition = node[1];
          const commands = node[2];
          if (evaluateCondition(condition)) {
            for (const element of commands) {
              visit(element);
            }
          }
        } else {
          throw new Error(`Unknown node type: ${node[0]}`);
        }
      }
  
      function evaluateExpression(expr) {
        if (expr[0] === 'INTEGER') {
          return parseInt(expr[1]);
        } else if (expr[0] === 'STRING') {
          return expr[1];
        } else if (expr[0] === 'input') {
          return readline(expr[1].replace(/"/g, ''));
        } else if (expr[0] === 'VAR') {
          const var_name = expr[1];
          if (var_name in variables) {
            return variables[var_name][0];
          } else {
            throw new Error(`Variable '${var_name}' is not defined.`);
          }
        } else if (expr[0] === 'binop') {
          const operator = expr[1];
          const left_expr = expr[2];
          const right_expr = expr[3];
          const left_value = evaluateExpression(left_expr);
          const right_value = evaluateExpression(right_expr);
          if (operator === 'PLUS') {
            return left_value + right_value;
          } else if (operator === 'MINUS') {
            return left_value - right_value;
          } else if (operator === 'TIMES') {
            return left_value * right_value;
          } else if (operator === 'DIVIDE') {
            return left_value / right_value;
          } else {
            throw new Error(`Unknown operator: ${operator}`);
          }
        } else {
          throw new Error(`Unknown expression type: ${expr[0]}`);
        }
      }
  
      function evaluateCondition(condition) {
        const condition_type = condition[0];
        const left_expr = condition[1][0];
        const right_expr = condition[1][1];
        if (condition_type === 'EQUAL') {
          return evaluateExpression(left_expr) === evaluateExpression(right_expr);
        } else if (condition_type === 'NOTEQUAL') {
          return evaluateExpression(left_expr) !== evaluateExpression(right_expr);
        } else if (condition_type === 'GREATER_THAN') {
          return evaluateExpression(left_expr) > evaluateExpression(right_expr);
        } else if (condition_type === 'LESS_THAN') {
          return evaluateExpression(left_expr) < evaluateExpression(right_expr);
        } else {
          throw new Error(`Unknown condition type: ${condition_type}`);
        }
      }
  
      for (const statement of ast) {
        visit(statement);
      }
    }
  }
  
  module.exports = Evaluator;
  