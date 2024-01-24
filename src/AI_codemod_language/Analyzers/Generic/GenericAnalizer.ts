import { parse } from 'yaml';
import { MainUtils } from '../../../HostMachine';

export class GenericAnalyzer {

    startToken = 'FBR_INDEX_START';
    endToken = 'FBR_INDEX_END';

    // Reads file content, asynchronously
    readFileContent(filePath: string): string {
        return MainUtils.read_file_from_absolute_path(filePath);
    }

    // Extracts YAML content enclosed between specific tokens
    getYamlContent(fileContent: string): { yaml_string: string, found: boolean } {
        const startIndex = fileContent.indexOf(this.startToken) + this.startToken.length;
        const endIndex = fileContent.indexOf(this.endToken);

        if (startIndex < 0 || endIndex < 0 || startIndex >= endIndex) {
            return {
                found: false,
                yaml_string: ''
            };
        }

        return {
            found: true,
            yaml_string: fileContent.substring(startIndex, endIndex).trim()
        };
    }

    // Parses a YAML string into a JavaScript object
    parseYamlString<T>(yamlString: string): { yaml_object: T | null, error: boolean } {
        try {
            return {
                error: false,
                yaml_object: parse(yamlString) as T
            };
        } catch (error) {
            // Handle parsing errors
            console.error('Error parsing YAML string:', error);
            return {
                error: true,
                yaml_object: null
            };
        }
    }
}
