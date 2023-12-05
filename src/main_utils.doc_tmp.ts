import { getGlobals } from 'common-es';
import { MaybePromise } from './types';
const { __dirname } = getGlobals(import.meta.url);
const FindFiles = require('file-regex');

/**
 * @class MainUtils
 * @description Utility class providing various file and directory operations.
 */
export class MainUtils {
    /**
     * Generates the root directory path with an optional appended path.
     * @param {string} [append_path=''] - Optional path to append to the root directory.
     * @returns {string} The full path combining the root directory and the appended path.
     * @note If 'append_path' starts with 'src/', it is replaced with '/'.
     */
    static root_directory(append_path = ''): string {
        // ... existing code ...
    }

    /**
     * Reads a file from the root directory.
     * @param {string} append_path - The path to append to the root directory for file reading.
     * @returns {{ fileContent: string }} An object containing the content of the file as a string.
     */
    static read_file_from_root(append_path: string): { fileContent: string } {
        // ... existing code ...
    }

    /**
     * Writes content to a file in the root directory.
     * @param {string} append_path - The path to append to the root directory for file writing.
     * @param {string} fileContent - The content to be written to the file.
     */
    static write_file_from_root(append_path: string, fileContent: string): void {
        // ... existing code ...
    }

    /**
     * Reads the names of all files in a directory with a specific extension.
     * @param {string} dir - The directory to read files from.
     * @param {string} ext - The file extension to filter by.
     * @returns {string[]} An array of file names with the specified extension.
     */
    static read_directory_by_ext(dir: string, ext: string): string[] {
        // ... existing code ...
    }

    /**
     * Creates a flat array of file names from a list of file paths.
     * @param {string[]} files - Array of file paths.
     * @returns {string[]} A flat array of file names.
     */
    static flat_tree_from_files(files: string[]): string[] {
        // ... existing code ...
    }

    /**
     * Creates a flat array of file names from a directory path.
     * @param {string} dir - The directory path to read files from.
     * @returns {string[]} A flat array of file names in the directory.
     */
    static flat_tree_from_path(dir: string): string[] {
        // ... existing code ...
    }

    /**
     * Reads the directory and returns an array of subdirectory paths.
     * @param {string} dir - The directory to read subdirectories from.
     * @returns {string[]} An array of paths for each subdirectory in the specified directory.
     */
    static read_directory(dir: string): string[] {
        // ... existing code ...
    }

    /**
     * Gets the paths of 'index.ts' files in all subdirectories of the root directory.
     * @returns {MaybePromise<string[]>} A promise that resolves to an array of index file paths.
     * @async
     */
    static getIndexPaths(): MaybePromise<string[]> {
        // ... existing code ...
    }

    /**
     * Asynchronously finds files in a directory that match a given regex pattern.
     * @param {string} dir - The directory to search within.
     * @param {RegExp} pattern - The regex pattern to match files against.
     * @returns {Promise<string[]>} A promise that resolves to an array of file paths matching the pattern.
     * @async
     * @throws Will throw an error if the file search operation fails.
     */
    static async findFilesByRegex(dir: string, pattern: RegExp): Promise<string[]> {
        // ... existing code ...
    }
}
