import { TS_Method_Fetcher } from "../TS_Fetcher";
import { GetProjectA_path, GetProjectA_tsconfig } from "./ProjecA/TestPath";

// Define your query string

describe('TS_Method_Fetcher', () => {
    let fetcher: TS_Method_Fetcher;
    const tsConfigPath = GetProjectA_tsconfig();
    const UserClssPath = GetProjectA_path('src/User.ts').replaceAll('\\', '/');

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


    describe('fetchMethodContent from string', () => {
        it('should  return the content of the specified method ', () => {
            const queryString = `Query: ${UserClssPath} cls:User.mth:createUser`;

            const content = fetcher.getMethodContentFromStringQuery(queryString) as string;
            expect(content.length > 0).toBeTruthy();
        });
    });

    // AfterAll or afterEach blocks for cleanup could be added here if needed
});
