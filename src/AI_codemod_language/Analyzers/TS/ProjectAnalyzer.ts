import { ClassDeclaration, JSDoc, Project, SourceFile, SyntaxKind } from "ts-morph";


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

        function isNotEmptyJsDocs(jsDocs: JSDoc[]) {
            return jsDocs.length > 0 && jsDocs[0].getInnerText().trim() !== '';
        }

        statements.forEach(statement => {

            // Narrowing down the statement type to those which can have JSDoc comments
            if (statement.isKind(SyntaxKind.FunctionDeclaration) ||
                statement.isKind(SyntaxKind.ClassDeclaration) ||
                statement.isKind(SyntaxKind.InterfaceDeclaration) ||
                statement.isKind(SyntaxKind.VariableStatement)) {


                // Increment the total statements count
                totalCount++;

                const jsDocs = statement.getJsDocs();
                if (isNotEmptyJsDocs(jsDocs)) {
                    documentedCount++;
                }




                if (statement.isKind(SyntaxKind.ClassDeclaration)) {
                    const classDeclaration = statement.asKind(SyntaxKind.ClassDeclaration) as ClassDeclaration;
                    classDeclaration.getMembers().forEach(member => {
                        totalCount++;

                        // TODO: check also for empty JSdocs, is means there is NOT JSDOC, Example
                        /**
                         * 
                        */
                        // func definition
                        //  OR /** */ + 
                        const jsDocs = member.getJsDocs();

                        if (isNotEmptyJsDocs(jsDocs)) {
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


}