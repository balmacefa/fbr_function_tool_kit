import Handlebars from "handlebars";
import { TypeScriptFileManipulator } from "../manipulators/TypeScriptFileManipulator";

type FileTestConfig = {
    id: string;
    file_path: string;
    queries: string[];
};

const file_path = "src/AI_codemod_language/tests/mocks/A/one_file.ts";

const fileTestConfigs: FileTestConfig[] = [
    {
        id: 'TC_01',
        file_path,
        queries: [
            "Query: {{file_path}}fn:log",
            "Query: {{file_path}}fn:log",
        ]
    },
    {
        id: 'TC_02',
        file_path, queries: [
            "Query: {{file_path}}fn:getUser",
            "Query: {{file_path}}cls:User",
            "Modify: {{file_path}}cls:User#email -> [new email definition]",
            "Add: {{file_path}}fn:newAPIFunction -> [API function definition]",
            "Delete: {{file_path}}mth:obsoleteMethod",
            "Search: src/**/*.ts.fn:*SearchQuery*",
            "DeepFetch: {{file_path}}cls:User.mth:getUserById",
            "Query: {{file_path}}cls:User.mth:createUser^L##",
        ]
    },
    {
        id: 'TC_03',
        file_path,
        queries: [
            "Query: {{file_path}}fn:utilityFunction",
            "Modify: {{file_path}}fn:utilityFunction -> [updated function definition]",
            "Add: {{file_path}}cls:NewClass -> [class definition]",
            "Delete: {{file_path}}cls:DeprecatedClass",
            "Search: src/**/*.ts.cls:NewClass",
            "DeepFetch: {{file_path}}fn:utilityFunction",
            "Query: {{file_path}}fn:utilityFunction^L##",
        ]
    },
    {
        id: 'TC_04',
        file_path,
        queries: [
            "Query: {{file_path}}cls:UserController",
            "Query: {{file_path}}cls:UserController.mth:createUser",
            "Modify: {{file_path}}cls:UserController#apiRoute -> [updated route definition]",
            "Add: {{file_path}}fn:newAPIFunction -> [API function definition]",
            "Delete: {{file_path}}mth:obsoleteMethod",
            "Search: src/**/*.ts.fn:*SearchQuery*",
            "DeepFetch: {{file_path}}cls:UserController.mth:getUserById",
            "Query: {{file_path}}cls:UserController.mth:createUser^L##",
        ]
    },
    // Additional file configurations can be added here
];

// fileTestConfigs[0].queries[0]({
//     file_path:''
// })


const testCases: { file_path: string, testCaseId: string, description: string, query: string }[] = [];
let testCaseId = 1;

fileTestConfigs.forEach(FileTestConfig => {
    FileTestConfig.queries.forEach(query => {
        testCases.push({
            file_path: FileTestConfig.file_path,
            testCaseId: `TC_Q_${testCaseId.toString().padStart(3, '0')}`,
            description: `Execute ${query}`,
            query: Handlebars.compile<{ file_path: string }>(query)({ file_path: FileTestConfig.file_path })
        });
        testCaseId++;
    });
});


describe("Query Test Cases", () => {
    testCases.forEach(({ testCaseId, description, query, file_path }) => {
        test(`${testCaseId}: ${description}`, () => {
            const tsManipulator = new TypeScriptFileManipulator(file_path);
            const result = tsManipulator.executeQuery(query);
            expect(result).toBeDefined(); // Adjust this expectation based on the actual implementation
        });
    });
});
