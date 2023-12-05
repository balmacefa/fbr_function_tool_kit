import { ClassDeclaration, MethodDeclaration, Project } from "ts-morph";
import { MainUtils } from '../main_utils';

/**
 * A class responsible for applying JSDoc comments from a documentation file to a source file.
 */
class JsDocApplier {
    private project: Project;
    private sourceFile: any;
    private docFile: any;

    /**
     * Initializes a new instance of the JsDocApplier class.
     * @param sourceFilePath The file path to the original TypeScript file.
     * @param docFilePath The file path to the temporary documentation file.
     */
    constructor(sourceFilePath: string, docFilePath: string) {
        this.project = new Project();
        this.sourceFile = this.project.addSourceFileAtPath(MainUtils.root_directory(sourceFilePath));
        this.docFile = this.project.addSourceFileAtPath(MainUtils.root_directory(docFilePath));
    }

    /**
     * Extracts JSDoc comments from a class or method declaration node.
     * @param node The class or method declaration node.
     * @returns The full text of the JSDoc comment, or null if no JSDoc is present.
     */
    private getJsDoc(node: ClassDeclaration | MethodDeclaration): string {
        const jsDocs = node.getJsDocs();
        return jsDocs.length > 0 ? jsDocs[0].getFullText() : '';
    }

    /**
     * Applies JSDoc comments to a class or method declaration node.
     * @param node The class or method declaration node to which the JSDoc will be applied.
     * @param jsDoc The JSDoc comment to apply.
     */
    private applyJsDoc(node: ClassDeclaration | MethodDeclaration, jsDoc: string): void {
        if (jsDoc) {
            node.addJsDoc(jsDoc);
        }
    }
    // 
    public static applyAndRemoveDocTmpFiles() {
        try {
            const docTmpFiles = MainUtils.read_directory_by_ext('.doc_tmp.ts');

            for (const docFilePath of docTmpFiles) {
                const sourceFilePath = docFilePath.replace('.doc_tmp.ts', '.ts');

                // Apply JSDoc comments
                const jsDocApplier = new JsDocApplier(sourceFilePath, docFilePath);
                jsDocApplier.applyDocsToSource();
                jsDocApplier.saveSourceFile();

                // Remove the .doc_tmp file
                // MainUtils.removeFile(docFilePath);
            }
        } catch (error) {
            console.error('Error in applying and removing .doc_tmp files:', error);
        }
    }

    /**
     * Applies JSDoc comments from the documentation file to the corresponding classes and methods in the source file.
     */
    public applyDocsToSource(): void {
        this.docFile.getClasses().forEach((docClass: ClassDeclaration) => {
            const className = docClass.getName() as string;
            const sourceClass = this.sourceFile.getClass(className);

            if (sourceClass) {
                this.applyJsDoc(sourceClass, this.getJsDoc(docClass));

                docClass.getMethods().forEach((docMethod: MethodDeclaration) => {
                    const methodName = docMethod.getName();
                    const sourceMethod = sourceClass.getMethod(methodName);

                    if (sourceMethod) {
                        this.applyJsDoc(sourceMethod, this.getJsDoc(docMethod));
                    }
                });
            }
        });
    }

    /**
     * Saves the updated source file.
     */
    public saveSourceFile(): void {
        this.sourceFile.saveSync();
    }
}

// TODO: look for all doc_tmp.ts then apply it, then remove the .doc_tmp file if operation succeed
// Use MainUtils.read_directory_by_ext ('.doc_tmp.ts')
// Example usage
const jsDocApplier = new JsDocApplier("src/main_utils.ts", "src/main_utils.doc_tmp.ts");
jsDocApplier.applyDocsToSource();
jsDocApplier.saveSourceFile();
