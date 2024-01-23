import { TS_Method_Fetcher } from "../TS_Fetcher";
import { GetProjectA_path, GetProjectA_tsconfig } from "./ProjecA/TestPath";

// Define your query string

describe('Query Language for AI', () => {
    let fetcher: TS_Method_Fetcher;
    const tsConfigPath = GetProjectA_tsconfig();
    const UserClssPath = GetProjectA_path('src/User.ts').replaceAll('\\', '/');
    const CommonFilePath = GetProjectA_path('src/NoComments.ts').replaceAll('\\', '/');

    beforeEach(() => {
        // Common setup for each test, initializing TS_Method_Fetcher instance
        fetcher = new TS_Method_Fetcher(tsConfigPath);
        // Additional setup for mocking filesystem, ts-morph behavior, etc.
    });

    describe('constructor', () => {
        it('should properly instantiate the TS_Method_Fetcher class', () => {
            expect(fetcher).toBeInstanceOf(TS_Method_Fetcher);
        });
    });


    describe('Query Content', () => {

        it('should return the entire content of a specified file', () => {
            const queryString = `Query: ${UserClssPath}`;
            const content = fetcher.getContentFromStringQuery(queryString) as string;
            expect(content.length > 0).toBeTruthy();
        });

        it('should return the content of a specified class', () => {
            const queryString = `Query: ${UserClssPath} cls:User`;
            const content = fetcher.getContentFromStringQuery(queryString) as string;
            expect(content.length > 0).toBeTruthy();
        });

        it('should return the content of a specified method', () => {
            const queryString = `Query: ${UserClssPath} cls:User.mth:createUser`;
            const content = fetcher.getContentFromStringQuery(queryString) as string;
            expect(content.length > 0).toBeTruthy();
        });

        it('should return the content of a specified function', () => {
            const functionName = 'function_foo';
            const queryString = `Query: ${CommonFilePath} fn:${functionName}`;
            const content = fetcher.getContentFromStringQuery(queryString) as string;
            expect(content.length > 0).toBeTruthy();
        });

        it('should return the content of a specified property', () => {
            const propertyName = 'foo';
            const queryString = `Query: ${CommonFilePath} prop:${propertyName}`;
            const content = fetcher.getContentFromStringQuery(queryString) as string;
            expect(content.length > 0).toBeTruthy();
        });

        // Additional negative test cases can be added to handle scenarios where the file, class, method, function, or property is not found
    });

    describe('Query Content + And Upsert JSDOC', () => {

        it('should upsert JSDOC entire content of a specified file', () => {
            const queryString = `Query: ${UserClssPath}`;
            const content = '<insert jsdoc>';
            const result = fetcher.applyJSDocFromStringQuery(queryString, content);
            expect(result).toEqual('JSDOC upsert correctly!');

        });

        it('should upsert JSDOC content of a specified class', () => {
            const queryString = `Query: ${UserClssPath} cls:User`;
            const content = '<insert jsdoc>';
            const result = fetcher.applyJSDocFromStringQuery(queryString, content);
            expect(result).toEqual('JSDOC upsert correctly!');

        });

        it('should upsert JSDOC content of a specified method', () => {
            const queryString = `Query: ${UserClssPath} cls:User.mth:createUser`;
            const content = '<insert jsdoc>';
            const result = fetcher.applyJSDocFromStringQuery(queryString, content);
            expect(result).toEqual('JSDOC upsert correctly!');
        });

        it('should upsert JSDOC content of a specified function', () => {
            const functionName = 'function_foo';
            const queryString = `Query: ${CommonFilePath} fn:${functionName}`;
            const content = '<insert jsdoc>';
            const result = fetcher.applyJSDocFromStringQuery(queryString, content);
            expect(result).toEqual('JSDOC upsert correctly!');
        });

        it('should upsert JSDOC content of a specified property', () => {
            const propertyName = 'foo';
            const queryString = `Query: ${CommonFilePath} prop:${propertyName}`;
            const content = '<insert jsdoc>';
            const result = fetcher.applyJSDocFromStringQuery(queryString, content);
            expect(result).toEqual('JSDOC upsert correctly!');
        });

    });

});


//     const NoCommentsPath = GetProjectA_path('src/NoComments.ts').replaceAll('\\', '/');
