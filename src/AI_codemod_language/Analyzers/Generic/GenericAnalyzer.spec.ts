import { GenericAnalyzer } from "./GenericAnalizer";
import { GetAnalizersGeneric_path } from "./HerePath";

describe('Generic File Analyzer for AI', () => {
    let fetcher: GenericAnalyzer;
    const expectedObject = {
        name: 'Test App',
        version: '1.0.0',
        dependencies: {
            express: '^4.17.1',
            mongoose: '^5.9.10'
        }
    };
    const yamlString = `
                name: Test App
                version: 1.0.0
                dependencies:
                  express: ^4.17.1
                  mongoose: ^5.9.10
            `;
    beforeEach(() => {
        fetcher = new GenericAnalyzer();
    });

    describe('constructor', () => {
        it('should properly instantiate the GenericAnalyzer class', () => {
            expect(fetcher).toBeInstanceOf(GenericAnalyzer);
        });
    });

    describe('getYamlContent', () => {
        it('should return YAML content enclosed between FBR_INDEX_START and FBR_INDEX_END tokens', () => {

            // Act
            const path = GetAnalizersGeneric_path('/docs/sample1.md');
            const file_content = fetcher.readFileContent(path);
            const yamlContent = fetcher.getYamlContent(file_content);

            expect(yamlContent.found).toBeTruthy();

            const parsedObject = fetcher.parseYamlString(yamlContent.yaml_string);

            // Assert
            expect(parsedObject.error).toEqual(false);
            expect(parsedObject.yaml_object).toEqual(expectedObject);
        });
    });

    describe('YAML Parsing', () => {
        it('should correctly parse a YAML string into a JavaScript object', () => {
            // Act
            const parsedObject = fetcher.parseYamlString(yamlString).yaml_object;

            // Assert
            expect(parsedObject).toEqual(expectedObject);
        });
    });

});
