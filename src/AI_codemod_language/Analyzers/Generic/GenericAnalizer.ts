import readdirp from 'readdirp';
import { MainUtils } from '../../../HostMachine';

export class GenericAnalyzer {

    startToken = 'FBR_INDEX_START';
    endToken = 'FBR_INDEX_END';
    jsonRegex = /\{[^{}]*\}/;

    // Reads file content, asynchronously
    readFileContent(filePath: string): string {
        return MainUtils.read_file_from_absolute_path(filePath);
    }

    // Extracts content enclosed between specific tokens
    getEnclosedContent(fileContent: string): { content: string, found: boolean } {
        const startIndex = fileContent.indexOf(this.startToken) + this.startToken.length;
        const endIndex = fileContent.indexOf(this.endToken);

        if (startIndex < 0 || endIndex < 0 || startIndex >= endIndex) {
            return {
                found: false,
                content: ''
            };
        }

        return {
            found: true,
            content: fileContent.substring(startIndex, endIndex).trim()
        };
    }

    // Extracts and parses JSON content from the enclosed content
    parseJsonFromContent(content: string): { jsonObject: any | null, error: boolean } {
        const match = content.match(this.jsonRegex);
        if (!match) {
            return { error: true, jsonObject: null };
        }
        try {
            const jsonObject = JSON.parse(match[0]);
            return { error: false, jsonObject };
        } catch (error) {
            console.error('Error parsing JSON content:', error);
            return { error: true, jsonObject: null };
        }
    }

    // Main function to analyze file content
    analyzeFileContent(filePath: string): { contentWithoutJson: string, json: any | null, error: boolean } {
        const fileContent = this.readFileContent(filePath);
        const { content, found } = this.getEnclosedContent(fileContent);

        if (!found) {
            return {
                contentWithoutJson: '',
                json: null,
                error: true
            };
        }

        const { jsonObject, error } = this.parseJsonFromContent(content);

        let contentWithoutJson = content;
        if (!error && jsonObject) {
            // Remove the JSON string from the content
            contentWithoutJson = content.replace(this.jsonRegex, '').trim();
        }

        return {
            contentWithoutJson,
            json: error ? null : jsonObject,
            error
        };
    }

    async analyzeDirectoryContent(dir_path: string) {

        const entries = await readdirp.promise(dir_path, { type: 'all' });
        const entries_flat = entries.map((entry) => {
            const jsonContentFile = this.analyzeFileContent(entry.fullPath);
            const metadata = {
                absolute_file_full_path: entry.fullPath,
                ...jsonContentFile.json
            }
            const d = {
                content: jsonContentFile.contentWithoutJson,
                metadata
            }
            return d;
        });
        return entries_flat;
    }

}
