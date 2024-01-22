import { ClassDeclaration, MethodDeclaration, SourceFile } from "ts-morph";
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
   * Parses the input string query and fetches the content of the specified method.
   * @param {string} queryString - The query string in the format "Query: {{file_path}}cls:ClassName.mth:MethodName"
   * @returns {MethodContent | null} The content of the method, or null if not found.
   */
    public getMethodContentFromStringQuery(queryString: string): string | null {
        // Define the regex pattern
        const regexPattern = /Query: (.+?) cls:(.+?)\.mth:(.+)/;

        // Match the string against the regex pattern
        const matches = queryString.match(regexPattern);

        if (matches) {
            const [, filePath, className, methodName] = matches;

            // Use the extracted parts to fetch the method content
            return this.fetchMethodContent(filePath, className, methodName);
        } else {
            console.error('String did not match the expected format.');
            return null;
        }
    }
}
