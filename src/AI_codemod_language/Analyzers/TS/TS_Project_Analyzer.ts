import { ClassDeclaration, ClassMemberTypes, FunctionDeclaration, InterfaceDeclaration, Project, SourceFile, Statement, SyntaxKind, VariableStatement } from "ts-morph";


export interface AnalysisResult {
    filePath: string;
    coverage: string;
    documentedCount: number;
    totalCount: number;
}

export interface ProjectAnalysis {
    files: AnalysisResult[];
    totalCoverage: string;
}

export type JSDocstatement = FunctionDeclaration | ClassDeclaration | InterfaceDeclaration | VariableStatement | ClassMemberTypes;

/**
 * @class TS_Project_Analyzer
 * @description Esta clase proporciona funcionalidades para analizar proyectos TypeScript,
 *              evaluando la cobertura de documentación en el código. Utiliza la configuración
 *              de TypeScript para identificar y analizar archivos dentro del proyecto.
 *              - **Para los Arquitectos:** La clase gestiona la configuración del proyecto y el análisis de archivos,
 *                permitiendo una integración modular y escalable con sistemas más grandes. La estructura del código
 *                y la utilización de principios de diseño limpio facilitan la expansión y el mantenimiento del sistema.
 *              - **Para los Desarrolladores:** Cada método dentro de la clase está documentado detalladamente,
 *                incluyendo descripciones de parámetros y valores de retorno, para facilitar la comprensión, el desarrollo,
 *                y la colaboración en el código. Las abstracciones claras y la separación de preocupaciones permiten
 *                una integración y modificación sencillas.
 *              - **Para los Gerentes:** Esta clase automatiza el proceso de medir la calidad de la documentación,
 *                proporcionando métricas esenciales para la toma de decisiones y la gestión del proyecto. Los informes
 *                generados pueden ser utilizados para evaluar el progreso y asegurar el cumplimiento de los estándares de calidad.
 *              - **Para las Partes Interesadas:** La claridad en la documentación y las métricas proporcionadas
 *                apoyan la transparencia y la calidad del producto, factores cruciales para la satisfacción del cliente
 *                y la aceptación del producto. La facilidad de mantenimiento y la escalabilidad aseguran la longevidad
 *                y la adaptabilidad del proyecto a largo plazo.
 * @property {Project} project - Instancia de Project de ts-morph para el análisis del proyecto.
 * @property {string} tsConfigPath - Ruta hacia el archivo de configuración de TypeScript.
 */
export class TS_Project_Analyzer {
    public project: Project;
    public tsConfigPath: string;

    /**
     * @constructor
     * @description Crea una instancia de TS_Project_Analyzer.
     * @param {string} tsConfigPath - Ruta hacia el archivo de configuración de TypeScript.
     */
    constructor(tsConfigPath: string) {
        this.tsConfigPath = tsConfigPath;
        this.project = new Project({
            tsConfigFilePath: this.tsConfigPath
        });
    }

    /**
     * @public
     * @function analyzeFile
     * @description Analiza un archivo TypeScript para determinar la cobertura de documentación de su código.
     *              Calcula el porcentaje de declaraciones documentadas (p.ej., funciones, clases).
     * @param {SourceFile} sourceFile - Archivo TypeScript a analizar.
     * @returns {AnalysisResult} Resultados del análisis, incluyendo la ruta del archivo, cobertura, etc.
     */
    public analyzeFile(sourceFile: SourceFile): AnalysisResult {
        const filePath = sourceFile.getFilePath();
        const statements = sourceFile.getStatements();

        // Initialize counters
        let documentedCount = 0;
        let totalCount = 0;


        statements.forEach(statement => {

            // Narrowing down the statement type to those which can have JSDoc comments
            if (this.statement_type_hasJSDoc(statement)) {
                // Increment the total statements count
                totalCount++;
                if (this.hasJSDoc(statement as JSDocstatement)) {
                    documentedCount++;
                }

                if (statement.isKind(SyntaxKind.ClassDeclaration)) {
                    const classDeclaration = statement.asKind(SyntaxKind.ClassDeclaration) as ClassDeclaration;
                    classDeclaration.getMembers().forEach(member => {
                        totalCount++;

                        if (this.hasJSDoc(member as JSDocstatement)) {
                            documentedCount++;
                        }
                    });
                }
            }
        });

        const coverage = (documentedCount / totalCount) * 100;

        return {
            filePath,
            coverage: coverage.toFixed(2) + '%',
            documentedCount,
            totalCount
        };
    }

    /**
     * @public
     * @function analyzeProject
     * @description Analiza todos los archivos TypeScript del proyecto para calcular la cobertura global de documentación.
     * @returns {ProjectAnalysis} Análisis agregado de todos los archivos, incluyendo cobertura total.
     */
    public analyzeProject(): ProjectAnalysis {
        const sourceFiles = this.project.getSourceFiles();
        const analysisResults = sourceFiles.map(sourceFile => this.analyzeFile(sourceFile));

        const totalDocumentedStatements = analysisResults.reduce((sum, file) => sum + file.documentedCount, 0);
        const totalStatements = analysisResults.reduce((sum, file) => sum + file.totalCount, 0);
        const totalCoverage = (totalDocumentedStatements / totalStatements) * 100;

        return {
            files: analysisResults,
            totalCoverage: totalCoverage.toFixed(2) + '%'
        };
    }


    /**
     * @public
     * @function getSourceFileFromPath
     * @description Retrieves a SourceFile object from the given file path if it exists in the project.
     * @param {string} filePath - The path to the TypeScript file.
     * @returns {SourceFile | undefined} The SourceFile object if found, otherwise undefined.
     */
    public getSourceFileFromPath(filePath: string): SourceFile | undefined {
        return this.project.getSourceFile(filePath);
    }


    /**
 * @public
 * @function getProjectFilePaths
 * @description Returns a list of all file paths in the TypeScript project.
 * @returns {string[]} An array of file paths.
 */
    public getProjectFilePaths(): string[] {
        const sourceFiles = this.project.getSourceFiles();
        return sourceFiles.map(file => file.getFilePath());
    }



    /**
        * Checks if a node has JSDoc comments.
        * @param node The node to check.
        * @returns True if the node has JSDoc comments, false otherwise.
        */
    public statement_type_hasJSDoc(statement: Statement): boolean {

        if (statement.isKind(SyntaxKind.FunctionDeclaration) ||
            statement.isKind(SyntaxKind.ClassDeclaration) ||
            statement.isKind(SyntaxKind.InterfaceDeclaration) ||
            statement.isKind(SyntaxKind.ClassExpression) ||
            statement.isKind(SyntaxKind.VariableStatement)) {
            return true;
        }
        return false;

    }
    /**
        * Checks if a node has JSDoc comments.
        * @param node The node to check.
        * @returns True if the node has JSDoc comments, false otherwise.
        */
    public hasJSDoc(statement: JSDocstatement): boolean {
        const jsDocs = (statement as JSDocstatement).getJsDocs();
        return jsDocs.length > 0 && jsDocs[0].getInnerText().trim() !== '';

    }

    /**
     * Checks if a node lacks JSDoc comments.
     * @param node The node to check.
     * @returns True if the node lacks JSDoc comments, false otherwise.
     */
    public lacksJSDoc(statement: JSDocstatement): boolean {
        const jsDocs = (statement as JSDocstatement).getJsDocs();
        if (jsDocs.length === 0) {
            return true;
        } else if (jsDocs[0].getInnerText().trim() === '') {
            return true;
        }

        return false;
    }


    /**
 * Generates a file containing all statements without JSDocs.
 * @param sourceFile The source file to analyze.
 * @returns A string representing the file content.
 */
    public generateFileWithoutJSDocs(sourceFile: SourceFile, statement_divider = '\n---\n'): string {
        let fileContent = '';

        // Helper function to process each node
        const processNode = (node: Statement) => {
            // Narrowing down the statement type to those which can have JSDoc comments
            if (this.statement_type_hasJSDoc(node)) {
                if (this.lacksJSDoc(node as JSDocstatement)) {
                    fileContent += node.getText() + statement_divider;
                }
            }

            if (node.isKind(SyntaxKind.ClassDeclaration)) {
                const classDeclaration = node.asKind(SyntaxKind.ClassDeclaration) as ClassDeclaration;
                const members = classDeclaration.getMembers();
                const membersWithoutJSDoc = members.filter(member => this.lacksJSDoc(member as JSDocstatement));

                // If the class or any member lacks JSDoc, then process the class
                if (this.lacksJSDoc(classDeclaration as JSDocstatement) || membersWithoutJSDoc.length > 0) {
                    // Add class opening, e.g., 'class MyClass {'
                    const clss_name = classDeclaration.getNameNode()?.getText()
                    fileContent += 'START MEMBERS OF CLASS ' + clss_name + ' {\n';

                    // Add members without JSDoc
                    membersWithoutJSDoc.forEach(member => {
                        fileContent += statement_divider + member.getText() + statement_divider;
                    });

                    fileContent += '} END MEMBERS OF CLASS ' + clss_name + statement_divider;
                    // Add class closing, e.g., '}'
                }
            }
        };

        // Process each statement in the source file
        const statements = sourceFile.getStatements();
        statements.forEach(node => processNode(node));

        return fileContent.trim(); // Remove the trailing statement_divider if it's the last element in the content
    }


    /**
     * Generates a file containing all statements with JSDocs.
     * @param sourceFile The source file to analyze.
     * @returns A string representing the file content.
     */
    public generateFileWithJSDocs(sourceFile: SourceFile): string {
        let fileContent = '';
        const nodes = [...sourceFile.getClasses(), ...sourceFile.getFunctions(), ...sourceFile.getInterfaces(), ...sourceFile.getTypeAliases()];

        nodes.forEach(node => {
            if (this.statement_type_hasJSDoc(node)) {
                if (this.hasJSDoc(node as JSDocstatement)) {
                    // TODO create a func to get the JSDOC + the content of the node to the response
                    fileContent += node.getText() + '\n\n';
                }
            }
        });

        return fileContent;
    }


}