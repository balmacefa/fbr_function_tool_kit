import fs from "fs";
import path from "path";
import { MaybePromise } from '../types';
// const { __dirname } = getGlobals(import.meta.url);
const FindFiles = require('file-regex');

/** */
export class MainUtils {

    private static root_path = '';

    // dic_map
    static by_extesion = MainUtils.read_directory_by_ext;

    // save_file
    static save_file = MainUtils.write_file_from_root;
    /** */
    static get_root_path(): string {
        return MainUtils.root_path;
    }
    static set_root_path(new_root_path: string) {
        MainUtils.root_path = new_root_path;
    }
    static root_directory(append_path = ''): string {

        if (MainUtils.root_path === '') {
            // Todu: change to .evn config
            throw new Error('ERROR ON @balmcefa/fbr_function_tool_kit HostMachine MainUtils.root_path is not setup for this project!')
        }

        return path.join(MainUtils.root_path, append_path);
    }

    /** */
    static read_file_from_root(append_path: string): { fileContent: string } {
        const filePath = MainUtils.root_directory(append_path);
        const fileContent = MainUtils.read_file_from_path(filePath);
        return { fileContent };
    }
    static join_path(a: string, b: string): string { return path.join(a, b) }
    static read_file_from_path(filePath: string): string {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent;
    }

    /** */
    static write_file_from_root(append_path: string, fileContent: string): void {
        const filePath = MainUtils.root_directory(append_path);
        fs.writeFileSync(filePath, fileContent);
    }

    static saveContentToFile = MainUtils.write_file_from_root;

    /** */
    static read_directory_by_ext(ext: string, dir?: string): string[] {
        if (dir === '' || dir === undefined) {
            dir = MainUtils.root_directory();
        }
        const files = fs.readdirSync(dir);
        return files.filter(file => file.endsWith(ext));
    }

    /** */
    static flat_tree_from_files(files: string[]): string[] {
        return files.map(file => path.basename(file));
    }

    /** */
    static flat_tree_from_path(dir: string): string[] {
        const files = MainUtils.read_directory(dir);
        return MainUtils.flat_tree_from_files(files);
    }

    /** */
    static read_directory(dir: string): string[] {
        return fs.readdirSync(dir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(dir, dirent.name));
    }

    /** */
    static getIndexPaths(): MaybePromise<string[]> {
        const rootDir = MainUtils.root_directory();
        const directories = fs.readdirSync(rootDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const indexPaths: string[] = [];
        for (const dir of directories) {
            const indexPath = path.join(rootDir, dir, 'index.ts');
            if (fs.existsSync(indexPath)) {
                indexPaths.push(indexPath);
            }
        }
        return indexPaths;
    }

    /** */
    static async findFilesByRegex(dir: string, pattern: RegExp): Promise<string[]> {
        try {
            const result = await FindFiles(dir, pattern, 0, { concurrency: 10 });
            return result.map((fileInfo: { dir: string; file: string; }) => path.join(fileInfo.dir, fileInfo.file));
        } catch (error) {
            console.error('Error in findFilesByRegex:', error);
            throw error;
        }
    }

    static findCliScripts(): string[] {
        return MainUtils.read_directory_by_ext('.cli.ts');
    }

    /**
     * Removes a file from the file system.
     * @param filePath The path of the file to be removed.
     */
    static removeFile(filePath: string): void {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(`Error removing file ${filePath}:`, error);
            throw error; // Re-throw the error for external handling, if necessary
        }
    }

    // save_file

    static createDirectory(path: string) {
        // TODO: implement
    }

}
