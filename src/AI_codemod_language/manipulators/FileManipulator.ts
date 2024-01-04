// src/manipulators/FileManipulator.ts

// Definición de los posibles QueryActions
const queryActions = ['Query', 'Modify', 'Add', 'Delete', 'Search', 'SemanticDocSearch', 'DeepFetch', 'CustomTask'] as const;

// Definición de las abreviaciones
const abbreviations = ['file', 'fn', 'cls', 'prop', 'mth', 'l', 'lr'] as const;

// Definición de los modificadores de salida, incluyendo la opción vacía
const outputModifiers = ['^', 'L##'] as const;

type QueryActionType = typeof queryActions[number];
type AbbreviationType = typeof abbreviations[number];
type OutputModifierType = typeof outputModifiers[number];

type query_path = {
    action: QueryActionType;
    file_path: string;
    abbreviation: AbbreviationType;
    modifier?: OutputModifierType;
};

// Función para generar todas las permutaciones posibles
function generatePermutations(file_path = './mock.txt'): query_path[] {
    const permutations: query_path[] = [];
    for (const action of queryActions) {
        for (const abbreviation of abbreviations) {
            for (const modifier of outputModifiers) {

                permutations.push({
                    action,
                    abbreviation,
                    file_path,
                    modifier
                });
            }
        }
    }
    return permutations;
}

// Generar las permutaciones
const permutations = generatePermutations();

// Mostrar solo los primeros 10 resultados
console.log(permutations.slice(0, 10));

export class QueryParts {
    rawQuery: string;

    lineNumbers?: number[];
    query_path: Required<query_path>;

    constructor(queryString: string) {
        this.rawQuery = queryString;
        // Patron <{{action}}:<QueryAction> {{file_path}}:<string> {{abbreviations}}:<string> {{optional group?output_modifiers:<command separeted>}}>
    }
}


export abstract class FileManipulator {
    filePath: string;
    query_path: QueryParts;

    constructor(filePath: string, queryParts: QueryParts) {
        this.filePath = filePath;
        this.query_path = queryParts;
    }

    executeQuery(query: string): string {
        const queryParts = new QueryParts(query);

        switch (queryParts.query_path.action) {
            case "Query":
                return this.executeQueryAction(queryParts);
            case "Modify":
                return this.executeModifyAction(queryParts);
            case "Add":
                return this.executeAddAction(queryParts);
            case "Delete":
                return this.executeDeleteAction(queryParts);
            case "Search":
                return this.executeSearchAction(queryParts);
            case "DeepFetch":
                return this.executeDeepFetchAction(queryParts);
            default:
                throw new Error(`Invalid action: ${queryParts.query_path.action}`);
        }
    }

    abstract executeQueryAction(queryParts: QueryParts): string;
    abstract executeModifyAction(queryParts: QueryParts): string;
    abstract executeAddAction(queryParts: QueryParts): string;
    abstract executeDeleteAction(queryParts: QueryParts): string;
    abstract executeSearchAction(queryParts: QueryParts): string;
    abstract executeDeepFetchAction(queryParts: QueryParts): string;
}

