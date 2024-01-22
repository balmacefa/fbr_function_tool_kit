import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, SourceFile } from "ts-morph";
import { MainUtils } from "../../../HostMachine";
import { TS_Project_Analyzer } from "./ProjectAnalyzer";


/**
 * @class TS_Method_Fetcher
 * @description This class provides functionalities to fetch specific method content from a TypeScript file.
 *              It extends the TS_Project_Analyzer to utilize its project configuration and analysis capabilities.
 */
export class TS_Method_Fetcher extends TS_Project_Analyzer {

    /**
     * @constructor
     * @description Creates an instance of TS_Method_Fetcher.
     * @param {string} tsConfigPath - Path to the TypeScript configuration file.
     */
    constructor(tsConfigPath: string) {
        super(tsConfigPath);
    }

    /**
     * @public
     * @function fetchMethodContent
     * @description Fetches the content of a specified method from a specified class within a TypeScript file.
     * @param {string} filePath - The path to the TypeScript file.
     * @param {string} className - The name of the class containing the method.
     * @param {string} methodName - The name of the method to fetch.
     * @returns {MethodContent | null} The content of the method, or null if not found.
     */
    public fetchMethodContent(filePath: string, className: string, methodName: string): string | null {
        const sourceFile: SourceFile | undefined = this.project.getSourceFile(filePath);

        if (!sourceFile) {
            console.error(`File not found: ${filePath}`);
            return null;
        }

        const classes: ClassDeclaration[] = sourceFile.getClasses();
        for (const cls of classes) {
            if (cls.getName() === className) {
                const methods: MethodDeclaration[] = cls.getMethods();
                for (const method of methods) {
                    if (method.getName() === methodName) {
                        return method.getText();
                    }
                }
            }
        }

        console.error(`Method ${methodName} not found in class ${className} at ${filePath}`);
        return null;
    }



    /**
     * Fetches the content of a specified class from a TypeScript file.
     * @param {string} filePath - The path to the TypeScript file.
     * @param {string} className - The name of the class to fetch.
     * @returns {string | null} - The content of the class, or null if not found.
     */
    public fetchClassContent(filePath: string, className: string): string | null {
        const sourceFile: SourceFile | undefined = this.project.getSourceFile(filePath);

        if (!sourceFile) {
            console.error(`File not found: ${filePath}`);
            return null;
        }

        const classNode: ClassDeclaration | undefined = sourceFile.getClass(className);

        if (classNode) {
            return classNode.getText();
        } else {
            console.error(`Class ${className} not found in ${filePath}`);
            return null;
        }
    }



    /**
     * Fetches the content of a specified function at the file root level.
     * @param {string} filePath - The path to the TypeScript file.
     * @param {string} functionName - The name of the function to fetch.
     * @returns {string | null} - The content of the function, or null if not found.
     */
    public fetchFunctionContent(filePath: string, functionName: string): string | null {
        const sourceFile: SourceFile | undefined = this.project.getSourceFile(filePath);

        if (!sourceFile) {
            console.error(`File not found: ${filePath}`);
            return null;
        }

        const functionNode: FunctionDeclaration | undefined = sourceFile.getFunction(functionName);

        if (functionNode) {
            return functionNode.getText();
        } else {
            console.error(`Function ${functionName} not found in ${filePath}`);
            return null;
        }
    }


    /**
     * Fetches the content of a specified property or variable at the file root level.
     * @param {string} filePath - The path to the TypeScript file.
     * @param {string} propertyName - The name of the property or variable to fetch.
     * @returns {string | null} - The content of the property or variable, or null if not found.
     */
    public fetchPropertyContent(filePath: string, propertyName: string): string | null {
        const sourceFile: SourceFile | undefined = this.project.getSourceFile(filePath);

        if (!sourceFile) {
            console.error(`File not found: ${filePath}`);
            return null;
        }

        const variableStatement = sourceFile.getVariableStatement(propertyName);
        const variableDeclaration = variableStatement?.getDeclarationList().getDeclarations().find(d => d.getName() === propertyName);

        if (variableDeclaration) {
            return variableDeclaration.getText();
        } else {
            console.error(`Property/Variable ${propertyName} not found in ${filePath}`);
            return null;
        }
    }

    /**
     * Fetches the entire content of a specified TypeScript file.
     * @param {string} filePath - The path to the TypeScript file.
     * @returns {string | null} - The content of the file, or null if not found.
     */
    public fetchFileContent(filePath: string): string | null {
        try {
            const content = MainUtils.read_file_from_path(filePath);
            return content;
        } catch (error) {
            console.error(`Error reading file: ${filePath}`);
            return null;
        }
    }

    /**
     * Parses the input string query and fetches the content of the specified class, method, function, property, or the entire file.
     * @param {string} queryString - The query string in one of the following formats:
     *                              "Query: {{file_path}}" for entire file content
     *                              "Query: {{file_path}} cls:ClassName" for class content
     *                              "Query: {{file_path}} cls:ClassName.mth:MethodName" for method content
     *                              "Query: {{file_path}} fn:FunctionName" for function content
     *                              "Query: {{file_path}} prop:PropertyName" for property content
     * @returns {string | null} - The content of the class, method, function, property, or the entire file, or null if not found.
     */
    public getContentFromStringQuery(queryString: string): string | null {
        const methodRegexPattern = /Query: (.+?) cls:(.+?)\.mth:(.+)/;
        const classRegexPattern = /Query: (.+?) cls:(.+)/;
        const functionRegexPattern = /Query: (.+?) fn:(.+)/;
        const propertyRegexPattern = /Query: (.+?) prop:(.+)/;
        const fileRegexPattern = /^Query: (.+)$/;

        let matches;

        // Check if it's a method content request
        matches = queryString.match(methodRegexPattern);
        if (matches) {
            const [, filePath, className, methodName] = matches;
            return this.fetchMethodContent(filePath, className, methodName);
        }

        // Check if it's a class content request
        matches = queryString.match(classRegexPattern);
        if (matches) {
            const [, filePath, className] = matches;
            return this.fetchClassContent(filePath, className);
        }

        // Check if it's a function content request
        matches = queryString.match(functionRegexPattern);
        if (matches) {
            const [, filePath, functionName] = matches;
            return this.fetchFunctionContent(filePath, functionName);
        }

        // Check if it's a property content request
        matches = queryString.match(propertyRegexPattern);
        if (matches) {
            const [, filePath, propertyName] = matches;
            return this.fetchPropertyContent(filePath, propertyName);
        }

        // Check if it's a file content request
        matches = queryString.match(fileRegexPattern);
        if (matches) {
            const [, filePath] = matches;
            // Check if any specific type (class/method/function/property) is requested
            return this.fetchFileContent(filePath);
        }

        console.error('String did not match the expected format.');
        return null;
    }

}
