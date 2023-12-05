import { getGlobals } from 'common-es';
import fs from "fs";
import path from "path";
import { MaybePromise } from './types';
const { __dirname } = getGlobals(import.meta.url);
const FindFiles = require('file-regex');

export class MainUtils {
    static root_directory(append_path = ''): string {
        if (append_path === '') {
            return __dirname;
        }
        if (append_path.startsWith('src/')) {
            append_path = append_path.replace('src/', '/');
        }
        console.log('append_path', append_path);
        const root_directory = path.join(__dirname, '../../');
        console.log('root_directory', root_directory);
        return path.join(__dirname, append_path);
    }

    static read_file_from_root(append_path: string): { fileContent: string } {
        const filePath = MainUtils.root_directory(append_path);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return { fileContent };
    }

    static write_file_from_root(append_path: string, fileContent: string): void {
        const filePath = MainUtils.root_directory(append_path);
        fs.writeFileSync(filePath, fileContent);
    }

    static read_directory_by_ext(dir: string, ext: string): string[] {
        const files = fs.readdirSync(dir);
        return files.filter(file => file.endsWith(ext));
    }

    static flat_tree_from_files(files: string[]): string[] {
        return files.map(file => path.basename(file));
    }

    static flat_tree_from_path(dir: string): string[] {
        const files = MainUtils.read_directory(dir);
        return MainUtils.flat_tree_from_files(files);
    }

    static read_directory(dir: string): string[] {
        return fs.readdirSync(dir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => path.join(dir, dirent.name));
    }

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

    static async findFilesByRegex(dir: string, pattern: RegExp): Promise<string[]> {
        try {
            const result = await FindFiles(dir, pattern, 0, { concurrency: 10 });
            return result.map((fileInfo: { dir: string; file: string; }) => path.join(fileInfo.dir, fileInfo.file));
        } catch (error) {
            console.error('Error in findFilesByRegex:', error);
            throw error;
        }
    }
}
