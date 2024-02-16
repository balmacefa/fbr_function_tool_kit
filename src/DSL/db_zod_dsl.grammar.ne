// grammar.ne
@{%
const moo = require("moo");

const lexer = moo.compile({
  ws: {match: /\s+/, lineBreaks: true},
  string: /"[\s\S]*?"/,
  keyword: ['CREATE', 'TABLE', 'UNIQUE', 'REQUIRED'],
  identifier: /[a-zA-Z_][a-zA-Z0-9_]*/,
  type: ['String', 'Number', 'Boolean', 'Array', 'Date'],
  symbols: ['{', '}', ':', ','],
  // Define more token types as needed
});

%}

@lexer lexer

main -> _ "CREATE" _ "TABLE" _ identifier _ "{" _ fieldList _ "}" {%
    (data) => {
        return {
            type: "CreateTable",
            tableName: data[4],
            fields: data[8]
        };
    }
%}

fieldList -> field ("," _ field)* {%
    (data) => {
        return [data[0], ...data[2].map((x) => x[3])];
    }
%}

field -> identifier ":" _ type _ constraintList {%
    (data) => {
        return {
            name: data[0],
            type: data[4],
            constraints: data[6]
        };
    }
%}

constraintList -> (UNIQUE _)? (REQUIRED _)? {%
    (data) => {
        return {
            unique: !!data[0],
            required: !!data[2]
        };
    }
%}

// Add rules for UNIQUE, REQUIRED, and other aspects

_ -> ws*
