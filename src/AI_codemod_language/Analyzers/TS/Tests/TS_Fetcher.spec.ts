import { TS_Method_Fetcher } from "../TS_Fetcher";
import { GetProjectA_path, GetProjectA_tsconfig } from "./ProjecA/TestPath";

// Define your query string

describe('TS_Method_Fetcher', () => {
    let fetcher: TS_Method_Fetcher;
    const tsConfigPath = GetProjectA_tsconfig();
    const UserClssPath = GetProjectA_path('src/User.ts').replaceAll('\\', '/');
    const NoCommentsPath = GetProjectA_path('src/NoComments.ts').replaceAll('\\', '/');

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

    describe('fetchMethodContent', () => {
        it('should return the content of the specified method', () => {
            const mockFilePath = UserClssPath;
            const mockClassName = 'User';
            const mockMethodName = 'createUser';


            const content = fetcher.fetchMethodContent(mockFilePath, mockClassName, mockMethodName) as string;
            expect(content.length > 0).toBeTruthy();
        });

        it('should return null if the file is not found', () => {
            const mockFilePath = 'path/to/nonexistentfile.ts';
            const content = fetcher.fetchMethodContent(mockFilePath, 'SomeClass', 'someMethod');
            expect(content).toBeNull();
        });

        it('should return null if the method is not found in the class', () => {
            const mockFilePath = UserClssPath;
            const mockClassName = 'User';
            const nonExistentMethodName = 'nonExistentMethod';

            const content = fetcher.fetchMethodContent(mockFilePath, mockClassName, nonExistentMethodName);
            expect(content).toBeNull();
        });

        // Additional tests for edge cases or specific scenarios
    });

    describe('fetchClassContent', () => {
        it('should return the content of the specified method', () => {
            const mockFilePath = UserClssPath;
            const mockClassName = 'User';


            const content = fetcher.fetchClassContent(mockFilePath, mockClassName) as string;
            expect(content.length > 0).toBeTruthy();
            expect(content.length).toEqual(596);
        });

        it('should return null if the file is not found', () => {
            const content = fetcher.fetchClassContent('path/to/nonexistentfile.ts', 'SomeClass');
            expect(content).toBeNull();
        });

        it('should return null if the Class is not found ', () => {
            const mockFilePath = UserClssPath;
            const mockClassName = 'ClassNotFound';

            const content = fetcher.fetchClassContent(mockFilePath, mockClassName);
            expect(content).toBeNull();
        });

        // Additional tests for edge cases or specific scenarios
    });
    describe('fetchFunctionContent from File', () => {
        it('should return the content of the specified func', () => {
            const mockFilePath = NoCommentsPath
            const functionName = 'function_foo';


            const content = fetcher.fetchFunctionContent(mockFilePath, functionName) as string;
            expect(content.length > 0).toBeTruthy();
            expect(content.includes('function_foo(args: string')).toBeTruthy();
        });

        it('should return null if the file is not found', () => {
            const content = fetcher.fetchFunctionContent('path/to/nonexistentfile.ts', 'SomeClass');
            expect(content).toBeNull();
        });

        it('should return null if the Func is not found ', () => {
            const mockFilePath = NoCommentsPath
            const functionName = 'getUserProfile';

            const content = fetcher.fetchFunctionContent(mockFilePath, functionName);
            expect(content).toBeNull();
        });

        // Additional tests for edge cases or specific scenarios
    });

    describe('fetchPropertyContent from File', () => {
        it('should return the content of the specified func', () => {
            const mockFilePath = NoCommentsPath
            const propertyName = 'foo';


            const content = fetcher.fetchPropertyContent(mockFilePath, propertyName) as string;
            expect(content.length > 0).toBeTruthy();
            expect(content.includes('function_foo(args: string')).toBeTruthy();
        });

        it('should return null if the file is not found', () => {
            const content = fetcher.fetchPropertyContent('path/to/nonexistentfile.ts', 'SomePropertyName');
            expect(content).toBeNull();
        });

        it('should return null if the Func is not found ', () => {
            const mockFilePath = NoCommentsPath
            const propertyName = 'foo';

            const content = fetcher.fetchPropertyContent(mockFilePath, propertyName);
            expect(content).toBeNull();
        });

        // Additional tests for edge cases or specific scenarios
    });




    describe('Set JSDoc Content', () => {

        it('should set JSDoc for the entire file', () => {
            const jsDocString = `/**\n * File Level JSDoc\n */`;
            const result = fetcher.setFileJSDoc(UserClssPath, jsDocString);
            expect(result).toEqual('JSDOC upsert correctly!');
            // Additional checks to verify JSDoc was set correctly
        });

        it('should set JSDoc for a class', () => {
            const className = 'User';
            const jsDocString = `/**\n * Class Level JSDoc\n */`;
            const result = fetcher.setClassJSDoc(UserClssPath, className, jsDocString);
            expect(result).toEqual('JSDOC upsert correctly!');
            // Additional checks to verify JSDoc was set correctly
        });

        it('should set JSDoc for a method', () => {
            const className = 'User';
            const methodName = 'createUser';
            const jsDocString = `/**\n * Method Level JSDoc\n */`;
            const result = fetcher.setMethodJSDoc(UserClssPath, className, methodName, jsDocString);
            expect(result).toEqual('JSDOC upsert correctly!');
            // Additional checks to verify JSDoc was set correctly
        });

        it('should set JSDoc for a function', () => {
            const functionName = 'function_foo';
            const jsDocString = `/**\n * Function Level JSDoc\n */`;
            const CommonFilePath = NoCommentsPath

            const result = fetcher.setFunctionJSDoc(CommonFilePath, functionName, jsDocString);
            expect(result).toEqual('JSDOC upsert correctly!');
            // Additional checks to verify JSDoc was set correctly
        });

        it('should set JSDoc for a property', () => {
            const CommonFilePath = NoCommentsPath
            const propertyName = 'foo';
            const jsDocString = `/**\n * Property Level JSDoc\n */`;
            const result = fetcher.setPropertyJSDoc(CommonFilePath, propertyName, jsDocString);
            expect(result).toEqual('JSDOC upsert correctly!');
            // Additional checks to verify JSDoc was set correctly
        });

        // Additional test cases can be added for negative scenarios, e.g., when the file/class/method/function/property does not exist.
    });





    // AfterAll or afterEach blocks for cleanup could be added here if needed
});


