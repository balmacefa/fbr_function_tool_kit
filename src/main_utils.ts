import { getGlobals } from 'common-es';
import fs from "fs";
import path from "path";
const { __dirname, __filename } = getGlobals(import.meta.url)

export const MainUtils = {
    root_directory: (append_path: string = '') => {
        // This is the root directory of execution of the server
        // It is used to find the .env file server\Browser\Browser.ts
        if (append_path === '') {
            return __dirname;
        }
        // if append constains src\ then remove it we are already in src
        if (append_path.startsWith('src/')) {
            append_path = append_path.replace('src/', '/');
        }
        console.log('append_path', append_path);
        // get the root directory of the server
        const root_directory = path.join(__dirname, '../../');
        console.log('root_directory', root_directory);

        return path.join(__dirname, append_path);
    },
    read_file_from_root: (append_path: string) => {
        const path = MainUtils.root_directory(append_path);
        const fileContent = fs.readFileSync(path, 'utf8');
        return { fileContent: fileContent };
    },
    write_file_from_root: (append_path: string, fileContent: string) => {
        const path = MainUtils.root_directory(append_path);
        fs.writeFileSync(path, fileContent);
    },
    read_directory_by_ext: (dir: string, ext: string) => {
        const files = fs.readdirSync(dir);
        const files_by_ext = files.filter((file: string) => file.endsWith(ext));
        return files_by_ext;
    },
    flat_tree_from_files: (files: any): string[] => {
        const flat_tree = files.map((file: string) => {
            const file_path = path.join(MainUtils.root_directory(), file);
            const file_name = path.basename(file_path);
            return file_name;
        });
        return flat_tree;
    },
    flat_tree_from_path: (dir: string): string[] => {
        const files = MainUtils.read_directory(dir);
        const flat_tree = MainUtils.flat_tree_from_files(files);
        return flat_tree;
    },

    read_directory: (dir: string) => {
        // read recursively all files in a directory
        const files = fs.readdirSync(dir);
        const files_with_path = files.map((file: string) => {
            const file_path = path.join(dir, file);
            return file_path;
        });
        return files_with_path;
    },
};