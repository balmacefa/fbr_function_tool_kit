import { Express, Request, Response } from 'express';
import { Document } from "langchain/document";
import { z } from 'zod';
import { post_result_handler_embedding_search } from '../shared_types';
import { EmbeddingIndexInstance } from './EmbeddingIndex.exclude';



export const register_routes_buscador = (app: Express) => {



    // Define Zod schemas for the provided types
    const tesauroDerechoInternacionalClassificationSchema = z.enum([
        'consultative_opinions',
        'jurisprudence',
        'sentences',
        'decisions',
        'resolutions',
        'legal_opinions',
        'recommendations'
    ]);

    const orderByListSchema = z.enum(['datetime', 'relevance', '']);

    const searchFieldListSchema = z.enum(['content', 'header', 'title']);

    const chunkSizeValueSchema = z.enum(['0', '120', '512', '1024', '1635']);

    // Define the Zod schema for SelectedValuesType
    const inputSchema = z.object({
        search_filters: z.object({
            searchText: z.string(),
            highlight: z.boolean(),
            searchField: searchFieldListSchema,
            indexSize: chunkSizeValueSchema
        }),
        sorting_options: z.object({
            order_by: orderByListSchema,
            datetime_from: z.string(),
            datetime_to: z.string()
        }),
        filter_options: z.object({
            classification: tesauroDerechoInternacionalClassificationSchema.or(z.literal('')),
            source_org: z.string(),
            country: z.string(),
            category: z.string(),
            sub_category_1: z.string(),
            sub_category_2: z.literal('')
        }),
        page_options: z.object({
            current_page: z.number(),
            hits_limit: z.number()
        })
    });

    // Export the TypeScript type inferred from the Zod schema
    type inputSchemaType = z.infer<typeof inputSchema>;

    app.post(
        "/iiresodh/buscador/nueva_consulta",
        async (req: Request, res: Response) => {
            try {
                const validationResult = inputSchema.safeParse(req.body);
                if (!validationResult.success) {
                    return { status: 400, response: { error: 'Invalid input', details: validationResult.error } };
                } else {


                    const input: inputSchemaType = validationResult.data;

                    const query_text = input.search_filters.searchText;
                    const indexer = EmbeddingIndexInstance;
                    let hits: Document[];


                    try {
                        // perform the embbeding search and return the result
                        hits = await indexer.tesaurio_search(input);
                    } catch (error) {
                        // payload.logger.error(error);
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }

                    const paginated_response: post_result_handler_embedding_search = {
                        hits: hits,
                        totalDocs: hits.length,
                        page: 1,
                        limit: 25,
                        totalPages: 1,
                        pagingCounter: 1,
                        hasNextPage: false,
                        hasPrevPage: false,
                        nextPage: null,
                        prevPage: null,
                    };

                    if (input.search_filters.highlight) {
                        try {
                            const guided_reading: Document[] = await indexer.gen_guided_reading(query_text, hits);
                            paginated_response.hits = guided_reading;
                        } catch (error) {
                            // payload.logger.error(error);
                            return res.status(500).json({ message: 'Internal Server Error' });
                        }
                    }

                    // render the htmx 
                    // inputs are valid, perform the search
                    res.render("Buscador/hits_log", { paginated_response: paginated_response });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send("Server error occurred");
            }
        }
    );
};

export function convertToNestedObject(data: any) {
    const result = {};
    Object.keys(data).forEach(key => {
        const parts = key.split('___');
        let current: any = result;
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                current[part] = data[key];
            } else {
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    });
    return result;
    // Example usage
    // const formData = {
    //     'search_filters___highlight': true,
    //     'search_filters___indexSize': 1024
    // };
}
