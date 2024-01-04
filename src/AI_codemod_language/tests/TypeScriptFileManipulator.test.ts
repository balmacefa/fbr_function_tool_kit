// src\AI_codemod_language\tests\TypeScriptFileManipulator.test.ts

import { TypeScriptFileManipulator } from "../manipulators/TypeScriptFileManipulator";


// Define sample data for permutations
const filePaths = [
    "src/AI_codemod_language/tests/mocks/A/logger.ts",
    // "src/AI_codemod_language/tests/mocks/A/User.ts",
    // "src/AI_codemod_language/tests/mocks/A/UserController.ts"
];
const queryTypes = ["fn", "cls", "prop", "mth"];
const queryDetails = ["log", "User", "email", "getUserById"];
const lineNumbers = ["4", "1->6"];


function createTestCase(filePath: string, queryType: string, queryDetail: string, lineNumber?: string): string {
    let query = `Query: ${filePath}`;
    if (queryType) {
        query += `.${queryType}`;
    }
    if (queryDetail) {
        query += `:${queryDetail}`;
    }
    if (lineNumber) {
        query += `:${lineNumber}`;
    }
    return query;
}

const testCases: { testCaseId: string, description: string, query: string }[] = [];
let testCaseId = 1;

filePaths.forEach(filePath => {
    queryTypes.forEach(queryType => {
        queryDetails.forEach(queryDetail => {
            // Basic query test case
            testCases.push({
                testCaseId: `TC_Q_${testCaseId.toString().padStart(3, '0')}`,
                description: `Query ${queryType} '${queryDetail}' in '${filePath}'`,
                query: createTestCase(filePath, queryType, queryDetail)
            });
            testCaseId++;

            // Line-specific query test cases
            lineNumbers.forEach(lineNumber => {
                testCases.push({
                    testCaseId: `TC_Q_${testCaseId.toString().padStart(3, '0')}`,
                    description: `Query ${queryType} '${queryDetail}' at line '${lineNumber}' in '${filePath}'`,
                    query: createTestCase(filePath, queryType, queryDetail, lineNumber)
                });
                testCaseId++;
            });
        });
    });
});


// Assuming TypeScriptFileManipulator has methods to handle these queries
describe("Generated Query Test Cases", () => {
    testCases.forEach(({ testCaseId, description, query }) => {
        test(`${testCaseId}: ${description}`, () => {
            const tsManipulator = new TypeScriptFileManipulator(query);
            const result = tsManipulator.executeQuery(query);
            expect(result).toBeDefined(); // Adjust this expectation based on the actual implementation
        });
    });
});


describe("TypeScriptFileManipulator Query Actions", () => {
    let tsManipulator: TypeScriptFileManipulator;

    beforeEach(() => {
        // Assuming 'example.ts' is a valid TypeScript file in the project
        tsManipulator = new TypeScriptFileManipulator("path/to/example.ts");
    });

    test("Query a function", () => {
        const result = tsManipulator.queryFunction("exampleFunction");
        expect(result).toContain("function exampleFunction");
    });

    test("Query a class", () => {
        const result = tsManipulator.queryClass("ExampleClass");
        expect(result).toContain("class ExampleClass");
    });

    // More tests for querying properties, methods, etc.

    // Note: Add actual content checks based on the 'example.ts' file content
});

