import { Document } from "langchain/document";
import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TokenTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { omit } from "lodash";
import type { Document as MongoDBDocument } from "mongodb";
import { Collection, MongoClient } from "mongodb";

const EMBEDDING = 'embedding';

// SAMPLE DATA IN CSV FORMAT:
// "text", "id", "classification", "header", "content", "source", "source_org", "country", "category", "sub_category_1", "createdAt", "updatedAt", "interface_ts", "document_id", "path", "chunk_size", "target_collection", "type", "is_chunk", "loc", "chart_at_from", "chart_at_to", "chunk_index", "chunk_count", "date", "sub_category_2"
// "La campagna d'Italia fu l'insieme delle operazioni militari condotte dagli Alleati in Italia nell'ambito della seconda guerra mondiale, nel periodo che va dal giugno 1943 al maggio 1945; la campagna fu intrapresa prima per sconfiggere l'Italia fascista, la più debole tra le tre maggiori potenze dell'Asse, e poi, dopo la sua resa incondizionata annunciata l'8 settembre 1943, per attirare nella penisola italiana occupata dalle truppe del feldmaresciallo Albert Kesselring altre forze della Wehrmacht, alleggerendo così gli altri teatri europei.\n\nLa campagna, guidata da parte alleata prima dal generale Dwight D. Eisenhower e poi dal generale Harold Alexander, fu caratterizzata da una serie di sbarchi e da sanguinose battaglie di logoramento lungo le successive linee difensive approntate dall'esercito tedesco. Le truppe alleate, costituite da contingenti provenienti da molteplici nazioni, furono ostacolate dall'aspro territorio appenninico, dalle difficoltà climatiche e dalla tenace resistenza tedesca che provocarono forti perdite e il lento avanzamento del fronte. Roma non venne liberata fino al 4 giugno 1944 mentre la Linea Gotica fu superata solo nell'aprile 1945, quando l'offensiva finale alleata permise di raggiungere la pianura Padana e il 2 maggio 1945 costrinse alla resa le forze tedesche in Italia.\n\nAlla campagna d'Italia presero parte anche alcuni reparti della Repubblica Sociale Italiana che combatterono a fianco dei tedeschi e le formazioni del Corpo Italiano di Liberazione che invece combatterono insieme agli eserciti alleati. Durante la dura occupazione tedesca, si sviluppò il movimento della Resistenza italiana che organizzò una crescente attività militare di guerriglia nell'Italia centro-settentrionale che intralciò l'apparato militare e repressivo nazi-fascista.\n\nLeggi la voce · Tutte le voci in vetrina", "6536e0123e4bed96af379923", "sentences", "[TEST] La campagna d'Italia fu l'insieme delle operazioni militari condotte dagli Alleati in Italia nell'ambito della seconda guerra mondiale,", "La campagna d'Italia fu l'insieme delle operazioni militari condotte dagli Alleati in Italia nell'ambito della seconda guerra mondiale, nel periodo che va dal giugno 1943 al maggio 1945; la campagna fu intrapresa prima per sconfiggere l'Italia fascista, la più debole tra le tre maggiori potenze dell'Asse, e poi, dopo la sua resa incondizionata annunciata l'8 settembre 1943, per attirare nella penisola italiana occupata dalle truppe del feldmaresciallo Albert Kesselring altre forze della Wehrmacht, alleggerendo così gli altri teatri europei.\n\nLa campagna, guidata da parte alleata prima dal generale Dwight D. Eisenhower e poi dal generale Harold Alexander, fu caratterizzata da una serie di sbarchi e da sanguinose battaglie di logoramento lungo le successive linee difensive approntate dall'esercito tedesco. Le truppe alleate, costituite da contingenti provenienti da molteplici nazioni, furono ostacolate dall'aspro territorio appenninico, dalle difficoltà climatiche e dalla tenace resistenza tedesca che provocarono forti perdite e il lento avanzamento del fronte. Roma non venne liberata fino al 4 giugno 1944 mentre la Linea Gotica fu superata solo nell'aprile 1945, quando l'offensiva finale alleata permise di raggiungere la pianura Padana e il 2 maggio 1945 costrinse alla resa le forze tedesche in Italia.\n\nAlla campagna d'Italia presero parte anche alcuni reparti della Repubblica Sociale Italiana che combatterono a fianco dei tedeschi e le formazioni del Corpo Italiano di Liberazione che invece combatterono insieme agli eserciti alleati. Durante la dura occupazione tedesca, si sviluppò il movimento della Resistenza italiana che organizzò una crescente attività militare di guerriglia nell'Italia centro-settentrionale che intralciò l'apparato militare e repressivo nazi-fascista.\n\nLeggi la voce · Tutte le voci in vetrina", "https://it.wikipedia.org/wiki/Pagina_principale", "it_wikipedia", "Italia", "Wikipedia", "italiano", "2023-10-23T21:05:23.135Z", "2023-10-23T21:05:23.135Z", "type_tesauro_derecho_internacional", "6536e0123e4bed96af379923", "content", "1024", "tesauro_derecho_internacional", "one_path_one_document", "true", "{ 1 fields }", "0", "1845", "0", "1", "2023-10-23T06:00:00.000Z", "generale"

export class EmbeddingIndex {
    client: MongoDBAtlasVectorSearch;
    client_hf: MongoDBAtlasVectorSearch;
    encoder: string = 'context'; // context | details
    search_for: string = 'content';// content | headers
    embeddings_hf: HuggingFaceInferenceEmbeddings;
    collection: Collection<MongoDBDocument>;
    index_name: string;


    constructor(
        collection: Collection<MongoDBDocument>,
        collection_hf: Collection<MongoDBDocument>,
        index_name: string = "digestos_multi_type_cols_langchain_index",
        index_name_hf: string = "digestos_multi_type_cols_langchain_index",
    ) {

        this.embeddings_hf = new HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HUGGINGFACEHUB_API_KEY,
            model: "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
        });

        this.collection = collection;
        this.index_name = index_name;
        const embedding_oai: OpenAIEmbeddings = new OpenAIEmbeddings();

        const vector_store = new MongoDBAtlasVectorSearch(
            embedding_oai, {
            collection: this.collection,
            indexName: this.index_name,
        });
        const vector_store_hf = new MongoDBAtlasVectorSearch(
            this.embeddings_hf, {
            collection: collection_hf,
            indexName: index_name_hf,
        });
        this.client = vector_store;
        this.client_hf = vector_store_hf;
    }


    async tesaurio_search(query_data: TYPE_post_embedding_search_body): Promise<Document[]> {
        const {
            search_filters,
            filter_options,
            sorting_options,
            page_options
        } = query_data;

        const k = 25;

        payload.logger.info('HIT_FUNC similarity_search_with_type');

        const query_vector = await this.client.embeddings.embedQuery(search_filters.searchText);
        // payload.logger.info('HIT_FUNC similarity_search_with_type query_vector:: ' + query_vector);

        // Construye el filtro para $vectorSearch

        const vectorSearchFilter = this.createVectorSearchFilter(query_data);
        // payload.logger.info('HIT_FUNC similarity_search_with_type vectorSearchFilter:: ' + JSON.stringify(vectorSearchFilter));

        const pipeline: MongoDBDocument[] = [
            {
                $vectorSearch: {
                    index: this.index_name,
                    path: EMBEDDING,
                    queryVector: query_vector,
                    numCandidates: k * 10,
                    limit: k,
                    filter: vectorSearchFilter
                }
            },
            this.sategDatetimeFilter(sorting_options.datetime_from, sorting_options.datetime_to),
            {
                $set: {
                    score: { $meta: "vectorSearchScore" },
                }
            },
            {
                $project: {
                    [EMBEDDING]: 0,
                    "score": { "$meta": "searchScore" }
                }
            },
            this.stageOrderBy(sorting_options.order_by),
            ...this.stagePagination(page_options),
            // this stage remove duplicates, based on document_id
            {
                $group: {
                    _id: "$document_id",
                    doc: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$doc"
                }
            }
        ];

        const pipeline_cleaned = pipeline.filter((stage) => Object.keys(stage).length > 0);

        const results = this.collection.aggregate(pipeline_cleaned);
        const docs: Document[] = [];
        for await (const result of results) {
            const doc: Document = new Document({
                pageContent: result.text,
                metadata: omit(result, ['text'])
            });
            docs.push(doc);
        }

        return docs;
    }

    private createVectorSearchFilter(query_data: TYPE_post_embedding_search_body): any {
        const {
            filter_options,
            search_filters: {
                searchField,
                indexSize
            }
        } = query_data;
        const andCriteria: MongoDBDocument = [
            { 'type': { $eq: 'one_path_one_document' } }
        ];

        // Agregar el filtro basado en searchField, si es necesario
        if (searchField) {
            andCriteria.push({ 'path': { $eq: searchField } });
        }

        // Agregar el filtro basado en indexSize, si es necesario
        if (indexSize && indexSize > 0) {
            andCriteria.push({ 'chunk_size': { $eq: indexSize } });
        }

        // Agregar otros filtros basados en filterOptions
        // const filter_options: {
        //     classification: "" | "consultative_opinions" | "jurisprudence" | "sentences" | "decisions" | "resolutions" | "legal_opinions" | "recommendations";
        //     source_org: string;
        //     country: string;
        //     category: string;
        //     sub_category_1: string;
        //     sub_category_2: "";
        const filterOptsCriteria = this.stageFilterOptions(filter_options);
        if (Object.keys(filterOptsCriteria).length > 0) {
            andCriteria.push(filterOptsCriteria);
        }


        if (andCriteria.length === 0) {
            return {};
        }

        return { $and: andCriteria };
    }

    private stageFilterOptions(filterOptions: TYPE_post_embedding_search_body['filter_options']): any {
        const andCriteria = [];

        for (const [key, value] of Object.entries(filterOptions)) {
            if (value) {
                if (Array.isArray(value) && key === "category") {
                    andCriteria.push({ [key]: { $in: value } });
                } else {
                    andCriteria.push({ [key]: value });
                }
            }
        }

        // Si no hay criterios, devuelve un objeto vacío (sin filtro)
        return andCriteria.length === 0 ? {} : { $and: andCriteria };
    }

    private stagePagination(page_options: { current_page: number; hits_limit: number; }) {
        return [
            {
                $skip: (page_options.current_page - 1) * page_options.hits_limit
            },
            {
                $limit: page_options.hits_limit
            }
        ];
    }

    private stageOrderBy(order_by: string) {
        let order_by_stage = {};
        if (order_by) {
            let sortColumn = order_by === 'datetime' ? 'createdAt' : order_by === 'relevance' ? 'score' : null;
            if (sortColumn) {
                order_by_stage = {
                    $sort: {
                        [sortColumn]: -1 // Descending order
                    }
                };
            }
        }
        return order_by_stage;
    }

    private sategDatetimeFilter(datetime_from: string, datetime_to: string) {
        let datetimeFilterCondition: any = {};

        if (datetime_from) {
            datetimeFilterCondition['createdAt'] = { $gte: new Date(datetime_from) };
        }

        if (datetime_to) {
            datetimeFilterCondition['createdAt'] = { ...datetimeFilterCondition['createdAt'], $lte: new Date(datetime_to) };
        }

        const datetimeFilterStage = Object.keys(datetimeFilterCondition).length ? {
            $match: datetimeFilterCondition
        } : {};
        return datetimeFilterStage;
    }

    async save_collection_property_indexer(payload_document: type__indexer):
        Promise<boolean> {
        // Cualquir mtadata que se quiera guardar utilizar el type_payload_indxre_queue
        // se copiara cerca de la linea 116
        try {
            // crat a document
            const meta1 = omit(payload_document, INDEX_PATH) as metadata_type
            const metadata: metadata_type = {
                ...meta1,
                is_chunk: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            const doc: Document = new Document({
                pageContent: payload_document[INDEX_PATH],
                metadata: metadata
            });

            const chunkSize = metadata.chunk_size;

            if (chunkSize == 0) {
                const result = await this.client.addDocuments([doc]);
            }
            if (chunkSize > 0) {
                const splitter = new TokenTextSplitter({
                    chunkSize: chunkSize,
                    chunkOverlap: 0,
                });


                const mini_docs = await splitter.splitDocuments([doc]);

                const original_content = doc.pageContent;
                for (let j = 0; j < mini_docs.length; j++) {

                    // chartAtFrom - chartAtTo base on original_content and the result mini_docs[i].pageContent
                    const content = mini_docs[j].pageContent;

                    const from = original_content.indexOf(content);
                    if (from === -1) {
                        payload.logger.error('gen_guided_reading from === -1', { original_content, content });
                    }
                    const to = from + content.length;
                    const mini_metadata: chucked_metadata_type = {
                        ...mini_docs[j].metadata as metadata_type,
                        is_chunk: true,
                        chart_at_from: from,
                        chart_at_to: to,
                        chunk_index: j,
                        chunk_count: mini_docs.length,

                    }
                    //set metadata
                    mini_docs[j].metadata = mini_metadata;
                }

                const result = await this.client.addDocuments(mini_docs);
            }

            return true;
        } catch (error) {
            payload.logger.error('save_collection_property_indexer_pair', { error });
            return false;
        }
    }

    async gen_guided_reading(query_text: string, _docs: Document[]):
        Promise<Document[]> {
        // 1- gen a vectostore from docs ()
        // 2- search the vectostore with query_text with score
        // 3- filter score with treshold
        // 4- return the docs with index

        const splitter = new TokenTextSplitter({
            chunkSize: 60,
            chunkOverlap: 0,
        });

        const docs: Document[] = [];

        for (let i = 0; i < _docs.length; i++) {
            const dd = _docs[i];
            // omit metadata
            dd.metadata['_docs_index'] = i;

            const mini_docs = await splitter.splitDocuments([dd]);

            const original_content = dd.pageContent;
            for (let j = 0; j < mini_docs.length; j++) {
                // chartAtFrom - chartAtTo base on original_content and the result mini_docs[i].pageContent
                const content = mini_docs[j].pageContent;

                const from = original_content.indexOf(content);
                if (from === -1) {
                    payload.logger.error('gen_guided_reading from === -1', { original_content, content });
                }
                const to = from + content.length;

                //set metadata
                mini_docs[j].metadata['chart_at_from'] = from;
                mini_docs[j].metadata['chart_at_to'] = to;

                docs.push(mini_docs[j]);
            }
        }


        // unkown: do we need to get set the char at 'from' and 'to'?
        const vectorStore = await MemoryVectorStore.fromDocuments(
            docs,
            this.embeddings_hf
        );

        const guided_hits = await vectorStore.similaritySearchWithScore(query_text, _docs.length * 3);

        // this return and array with score >.4
        for (let i = 0; i < guided_hits.length; i++) {
            const mini_doc_score = guided_hits[i][1];

            // if (mini_doc_score < 0.4) {
            //     payload.logger.info('gen_guided_reading mini_doc_score < 0.4  ::: Score ->' + mini_doc_score);
            //     continue;
            // }
            const mini_doc_hit = guided_hits[i][0];
            const index = mini_doc_hit.metadata['_docs_index'];
            const originalChartAtsPairs: Array<{ from: number, to: number, score: number }> = _docs[index].metadata['highlights'] || [];
            originalChartAtsPairs.push({
                from: mini_doc_hit.metadata['chart_at_from'],
                to: mini_doc_hit.metadata['chart_at_to'],
                score: mini_doc_score
            });

            _docs[index].metadata['highlights'] = originalChartAtsPairs;
        }

        return _docs;

    }



}

export function getMongoDbClientCollection(): Collection<MongoDBDocument> {

    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    const [dbName, collectionName] = "IIRESODH_test.digestos_multi_type_cols".split(".");
    const collection = client.db(dbName).collection(collectionName);

    return collection;
}
export function getMongoDbClientCollection_hf(): Collection<MongoDBDocument> {

    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    const [dbName, collectionName] = "IIRESODH_test.search_index_hf768_dim_cols".split(".");
    const collection = client.db(dbName).collection(collectionName);

    return collection;
}

export const EmbeddingIndexInstance: EmbeddingIndex = new EmbeddingIndex(
    getMongoDbClientCollection(),
    getMongoDbClientCollection_hf(),
    "digestos_multi_type_cols_langchain_index",
    "digestos_multi_type_cols_hf_langchain_index",
)
