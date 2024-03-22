// // import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
// // import { FaissStore } from "@langchain/community/vectorstores/faiss";
// import { Document } from "langchain/document";
// import { GenericAnalyzer } from "./GenericAnalizer";

// export class DirectoryStore extends GenericAnalyzer {

//     model: HuggingFaceTransformersEmbeddings
//     dir_path: string
//     vectorStore!: FaissStore
//     constructor(dir_path: string) {
//         super();
//         this.model = new HuggingFaceTransformersEmbeddings({
//             modelName: "Xenova/all-MiniLM-L6-v2",
//         });
//         this.dir_path = dir_path;
//     }

//     async gen_vectore_store(): Promise<FaissStore> {

//         const files = await this.analyzeDirectoryContent(this.dir_path);

//         const vectorStore = await FaissStore.fromDocuments(
//             files.map((value) => {
//                 return new Document({
//                     pageContent: value.content,
//                     metadata: value.metadata
//                 })
//             }), this.model
//         );

//         this.vectorStore = vectorStore;
//         return this.vectorStore;
//     }

//     async search_files(args: {
//         query: string,
//         k?: number,
//         filter?: string | object | undefined
//     }) {

//         const {
//             query,
//             filter
//         } = args;

//         const k = args.k ? args.k : 12;
//         const result = await this.vectorStore.similaritySearchWithScore(query, k);
//         return result;
//     }
// }