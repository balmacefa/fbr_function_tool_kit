// import { DirectoryStore } from "./DirectoryStore";
// import { GetAnalizersGeneric_path } from "./HerePath";

// describe('Generic File Analyzer for AI', () => {
//     let fetcher: DirectoryStore;

//     beforeEach(async () => {
//         const dir_path = GetAnalizersGeneric_path('/index/');
//         fetcher = new DirectoryStore(dir_path);
//         await fetcher.gen_vectore_store();
//     });

//     describe('constructor', () => {
//         it('should properly instantiate the GenericAnalyzer class', () => {
//             expect(fetcher).toBeInstanceOf(DirectoryStore);
//         });
//     });

//     describe('get JSON Content', () => {

//         it('should return jsonContent for a folder', async () => {

//             //

//             const dir_path = GetAnalizersGeneric_path('/index/');
//             const dir_index = await fetcher.analyzeDirectoryContent(dir_path);
//             expect(dir_index.length).toEqual(5);


//             // Loop over the dir_path and extract the correponding jsonContent of all files
//             // Assert
//         });
//     });


// });
