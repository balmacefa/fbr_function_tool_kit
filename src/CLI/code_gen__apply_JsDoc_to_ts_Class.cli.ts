import { ClassDeclaration, MethodDeclaration, Project, SourceFile } from "ts-morph";
import { MainUtils } from '../HostMachine/main_utils';

/**
 * A class responsible for applying JSDoc comments from a documentation file to a source file.
 */
class JsDocApplier {
    private project: Project;
    private sourceFile: SourceFile;
    private docFile: SourceFile;

    /**
     * Initializes a new instance of the JsDocApplier class.
     * @param sourceFilePath The file path to the original TypeScript file.
     * @param docFilePath The file path to the temporary documentation file.
     */
    constructor(sourceFilePath: string, docFilePath: string) {
        this.project = new Project();
        this.sourceFile = this.project.addSourceFileAtPath(MainUtils.root_directory(sourceFilePath));
        this.docFile = this.project.addSourceFileAtPath(MainUtils.root_directory(docFilePath));
        console.log('constructe doc files')
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



    static applyDocTmpFiles() {
        try {
            const docTmpFiles = MainUtils.read_directory_by_ext('.doc_tmp.ts');
            for (const docFilePath of docTmpFiles) {
                const sourceFilePath = docFilePath.replace('.doc_tmp.ts', '.ts');
                const jsDocApplier = new JsDocApplier(sourceFilePath, docFilePath);

                try {
                    jsDocApplier.applyDocsToSource();
                    MainUtils.removeFile(docFilePath); // Remove the .doc_tmp file after successful application
                } catch (applyError) {
                    console.error(`Error applying docs for ${docFilePath}:`, applyError);
                    // Optionally handle specific cleanup or rollback actions here
                }
            }
        } catch (error) {
            console.error('Error in processing .doc_tmp files:', error);
        }
    }


    public applyDocsToSource(): void {
        this.docFile.getClasses().forEach((docClass: ClassDeclaration) => {
            const className = docClass.getName() as string;
            const sourceClass = this.sourceFile.getClass(className);

            if (sourceClass) {
                // TODO: review this code, this seams to be faing, the this.docFile, may have sintaye error and is ok, we only care about the 
                // jsdoc comments, class, and methods names.
                console.log('class found!', sourceClass);
                this.applyJsDoc(sourceClass, this.getJsDoc(docClass));

                docClass.getMethods().forEach((docMethod: MethodDeclaration) => {
                    const methodName = docMethod.getName();
                    const sourceMethod = sourceClass.getMethod(methodName);

                    if (sourceMethod) {
                        console.log('sourceMethod found!', sourceMethod);
                        this.applyJsDoc(sourceMethod, this.getJsDoc(docMethod));
                    }
                });
            }

            //save to file
            const patch_content = this.docFile.getFullText();
            MainUtils.save_file(this.sourceFile.getFilePath(), patch_content);
        });
    }
    public async mergeJSDocComments() {

        this.docFile.getClasses().forEach(docClass => {
            const sourceClass = this.sourceFile.getClass(`${docClass.getName()}`);
            if (sourceClass) {

                // get from .docFileClass
                const temp_file_class = this.sourceFile.getClass(`${docClass.getName()}`);
                if (temp_file_class) {
                    sourceClass.addJsDoc(sourceClass.getJsDocs().toString());
                }

                docClass.getMethods().forEach(docMethod => {
                    const sourceMethod = sourceClass.getMethod(docMethod.getName());
                    if (sourceMethod) {
                        // get from .docFileClass
                        // 
                        const temp_method = (temp_file_class as ClassDeclaration).getMethod(`${docMethod.getName()}`);
                        if (temp_method) {
                            sourceMethod.addJsDoc(temp_method.getJsDocs().toString());
                            console.log('completed! ');
                        }
                    }
                });
            }
        });

        // Save changes to the source file
        await this.sourceFile.saveSync();
    }


}

// TODO: look for all doc_tmp.ts then apply it, then remove the .doc_tmp file if operation succeed
// Use MainUtils.read_directory_by_ext ('.doc_tmp.ts')
// Example usage
// or:


(() => {
    // JsDocApplier.applyDocTmpFiles();
    // console.log('done');
    const jsDocApplier = new JsDocApplier("src/main_utils.ts", "src/main_utils.doc_tmp.ts");
    jsDocApplier.mergeJSDocComments();
    console.log('done 2');


})();

