import mongoose from "mongoose";
import { Parser, TableLexer } from "./db_zod_dsl.parser";

type FieldDefinition = {
    name: string;
    type: string;
    unique?: boolean;
    required?: boolean;
};

class db_zod_dsl {
    private parsedTable: { tableName: string; fields: FieldDefinition[] };

    constructor(dslString: string) {
        this.parsedTable = this.parseDsl(dslString);
    }

    private parseDsl(dslString: string): { tableName: string; fields: FieldDefinition[] } {
        const lexingResult = TableLexer.tokenize(dslString);
        if (lexingResult.errors.length > 0) {
            throw new Error("Lexing errors detected");
        }

        Parser.input = lexingResult.tokens;
        const cst = Parser.tableDefinition();

        if (Parser.errors.length > 0) {
            throw new Error("Parsing errors detected");
        }

        const tableName = cst.children.tableName[0].image;
        const fields = cst.children.fieldDefinition.map((fieldNode) => {
            const fieldName = fieldNode.children.fieldName[0].image;
            const dataType = fieldNode.children.dataType[0].image;
            const required = 'required' in fieldNode.children;
            const unique = 'unique' in fieldNode.children;

            return { name: fieldName, type: dataType, required, unique };
        });

        return { tableName, fields };
    }

    public generateMongooseSchema(): string {
        const fields = this.parsedTable.fields.map(field => {
            const fieldSchema = `{ type: ${mongoose.Schema.Types[field.type] || 'String'}, ${(field.unique ? 'unique: true, ' : '')}${(field.required ? 'required: true' : '')} }`;
            return `${field.name}: ${fieldSchema}`;
        }).join(',\n  ');

        return `const ${this.parsedTable.tableName}Schema = new mongoose.Schema({\n  ${fields}\n});\nmodule.exports = mongoose.model('${this.parsedTable.tableName}', ${this.parsedTable.tableName}Schema);`;
    }

    public generateZodSchema(): string {
        const fields = this.parsedTable.fields.map(field => {
            const fieldType = field.type.toLowerCase() === 'array' ? 'z.array(z.string())' : `z.${field.type.toLowerCase()}()`;
            const fieldSchema = field.required ? fieldType : `${fieldType}.optional()`;
            return `${field.name}: ${fieldSchema}`;
        }).join(',\n  ');

        return `const ${this.parsedTable.tableName}Schema = z.object({\n  ${fields}\n});\nexport default ${this.parsedTable.tableName}Schema;`;
    }
}

export default db_zod_dsl;
