import { CstParser, Lexer, createToken } from "chevrotain";

// Identifiers and Keywords
const CreateTable = createToken({ name: "CreateTable", pattern: /CREATE TABLE/ });
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });

// Symbols
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const LBrace = createToken({ name: "LBrace", pattern: /\{/ });
const RBrace = createToken({ name: "RBrace", pattern: /\}/ });

// Types and Modifiers
const Type = createToken({ name: "Type", pattern: /String|Number|Boolean|Date|Array/ });
const Required = createToken({ name: "Required", pattern: /REQUIRED/ });
const Unique = createToken({ name: "Unique", pattern: /UNIQUE/ });

// Define the order of tokens is important for the lexer
const allTokens = [
    CreateTable,
    Identifier,
    Colon,
    Semicolon,
    Comma,
    LBrace,
    RBrace,
    Type,
    Required,
    Unique
];
const TableLexer = new Lexer(allTokens);

class TableParser extends CstParser {
    constructor() {
        super(allTokens);

        const $ = this;

        $.RULE("tableDefinition", () => {
            $.CONSUME(CreateTable);
            $.CONSUME(Identifier, { LABEL: "tableName" });
            $.CONSUME(LBrace);
            $.MANY_SEP({
                SEP: Comma,
                DEF: () => {
                    $.SUBRULE($.fieldDefinition);
                }
            });
            $.CONSUME(RBrace);
            $.CONSUME(Semicolon);
        });

        $.RULE("fieldDefinition", () => {
            $.CONSUME(Identifier, { LABEL: "fieldName" });
            $.CONSUME(Colon);
            $.CONSUME(Type, { LABEL: "dataType" });
            $.OPTION(() => {
                $.CONSUME(Required, { LABEL: "required" });
            });
            $.OPTION(() => {
                $.CONSUME(Unique, { LABEL: "unique" });
            });
        });

        this.performSelfAnalysis();
    }
}

// Export the parser instance
const parserInstance = new TableParser();
export { parserInstance as Parser, TableLexer };

