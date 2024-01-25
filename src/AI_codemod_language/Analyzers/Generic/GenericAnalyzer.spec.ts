import { GenericAnalyzer } from "./GenericAnalizer";
import { GetAnalizersGeneric_path } from "./HerePath";

describe('Generic File Analyzer for AI', () => {
    let fetcher: GenericAnalyzer;

    beforeEach(() => {
        fetcher = new GenericAnalyzer();
    });

    describe('constructor', () => {
        it('should properly instantiate the GenericAnalyzer class', () => {
            expect(fetcher).toBeInstanceOf(GenericAnalyzer);
        });
    });

    describe('get JSON Content', () => {

        it('should return JSON and content enclosed between FBR_INDEX_START and FBR_INDEX_END tokens', () => {

            // Act
            const path = GetAnalizersGeneric_path('/docs/sample2.js');
            const jsonContent = fetcher.analyzeFileContent(path);

            // Assert
            expect(jsonContent.error).toEqual(false);
            expect(jsonContent.contentWithoutJson).toEqual('L1 Esto es un texto que no tiene propiedades pero lo que sigue si tiene\r\nL2 Esto es un texto que no tiene propiedades pero lo que sigue si tiene"');
            expect(jsonContent.json).toEqual({
                name: "Test App",
                version: "1.0.0"
            });
        });
        it('should return jsonContent for a folder', async () => {

            // 

            const dir_path = GetAnalizersGeneric_path('/docs/');
            const dir_index = await fetcher.analyzeDirectoryContent(dir_path);
            expect(dir_index).toEqual([]);


            // Loop over the dir_path and extract the correponding jsonContent of all files
            // Assert
        });
    });


});
