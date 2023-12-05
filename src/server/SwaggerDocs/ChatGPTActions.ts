// import {
//     OpenAPIRegistry,
//     extendZodWithOpenApi
// } from '@asteasolutions/zod-to-openapi';
// import { z } from 'zod';
// import { Response403 } from './SwaggerDocs.exclude';
// extendZodWithOpenApi(z);


// const metadataSchema = z.object({
//     _id: z.string(),
//     id: z.string(),
//     classification: z.string(),
//     header: z.string(),
//     content: z.string(),
//     source: z.string().optional(),
//     source_org: z.string(),
//     createdAt: z.string(),
//     updatedAt: z.string(),
//     interface_ts: z.string(),
//     document_id: z.string(),
//     path: z.string(),
//     chunk_size: z.number(),
//     target_collection: z.string(),
//     type: z.string(),
//     is_chunk: z.boolean(),
//     loc: z.object({
//         lines: z.object({
//             from: z.number(),
//             to: z.number(),
//         }),
//     }),
//     chart_at_from: z.number(),
//     chart_at_to: z.number(),
//     chunk_index: z.number(),
//     chunk_count: z.number(),
//     country: z.string().optional(),
//     category: z.string().optional(),
//     sub_category_1: z.string().optional(),
//     sub_category_2: z.string().optional(),
// });

// const responseSchema = z.object({
//     hits: z.array(z.object({
//         metadata: metadataSchema,
//     })),
//     totalDocs: z.number(),
//     page: z.number(),
//     limit: z.number(),
//     totalPages: z.number(),
//     pagingCounter: z.number(),
//     hasNextPage: z.boolean(),
//     hasPrevPage: z.boolean(),
//     nextPage: z.null().optional(),
//     prevPage: z.null().optional(),
// }).openapi({
//     example: {
//         hits: [
//             {
//                 "metadata": {
//                     "_id": "65513631aa07b611489a7b8c",
//                     "id": "6551362fba22f43e376043c4",
//                     "classification": "jurisprudence",
//                     "header": "Full participation of women in society. Right to nationality. Right to non-discrimination. Equal right of women to nationality.",
//                     "content": "Given the critical importance of nationality to the full participation of women in society...",
//                     "source": ".",
//                     "source_org": "ONU",
//                     "createdAt": "2023-11-12T20:31:44.518Z",
//                     "updatedAt": "2023-11-12T20:31:44.518Z",
//                     "interface_ts": "type_tesauro_derecho_internacional",
//                     "document_id": "6551362fba22f43e376043c4",
//                     "path": "header",
//                     "chunk_size": 1024,
//                     "target_collection": "tesauro_derecho_internacional",
//                     "type": "one_path_one_document",
//                     "is_chunk": true,
//                     "loc": {
//                         "lines": {
//                             "from": 1,
//                             "to": 1
//                         }
//                     },
//                     "chart_at_from": 0,
//                     "chart_at_to": 128,
//                     "chunk_index": 0,
//                     "chunk_count": 1,
//                     "country": "Country name or empty string if not applicable",
//                     "category": "Category name or empty string if not applicable",
//                     "sub_category_1": "Subcategory name or empty string if not applicable",
//                     "sub_category_2": "Subcategory name or empty string if not applicable"
//                 }
//             }
//         ],
//         totalDocs: 25,
//         page: 1,
//         limit: 25,
//         totalPages: 1,
//         pagingCounter: 1,
//         hasNextPage: false,
//         hasPrevPage: false,
//         nextPage: null,
//         prevPage: null
//     }
// });


// const TAG = 'Orders';

// export const mainChatGPTActions = (registry: OpenAPIRegistry) => {
//     GenerateBautizo(registry);
//     BuscarJurisprudencia(registry);
// };

// // POST / api / { collection- slug}	Create a new document
// const GenerateBautizo = (registry: OpenAPIRegistry) => {

//     const input_sample = `
//     86.	The Committees recommend that the States parties to the Conventions:
//     (a)	Ensure that protection services are mandated and adequately resourced to provide all necessary prevention and protection services to children and women that are or are at high risk of becoming victims of harmful practices;
//     (b)	Establish a toll - free, 24 - hour hotline which is staffed by trained counsellors to enable victims to report instances when a harmful practice is likely to occur or has occurred, provide referral to needed services as well as accurate information about harmful practices;
//     (c)	Develop and implement capacity - building programmes on their role in protection for judicial officers, including judges, lawyers, prosecutors and all relevant stakeholders, on legislation prohibiting discrimination and on applying laws in a gender and age - sensitive manner in conformity with the two Conventions;
//     (d)	Ensure that children participating in legal processes have access to appropriate child - sensitive services to safeguard their rights and safety and to limit the possible negative impacts of the proceedings.Protective actions may include limiting the number of times a victim is required to give statements and not requiring that individual to face the perpetrator(s).Other steps may include appointing a guardian ad litem(especially where the perpetrator is a parent or legal guardian) and ensuring child victims have access to adequate child - sensitive information about the process and fully understand what to expect;
//     (e)	Ensure that migrant women and children have equal access to services regardless of their legal status.
//     `;
//     // Create new order
//     registry.registerPath({
//         tags: [TAG],
//         method: 'post',
//         path: `/api/v1/${API_ROUTES.run_bautizo.url}`,
//         description: 'Generador de descripciones legales concisas: Una herramienta que produce descripciones breves y concisas para resumir asuntos legales. iiresodh',
//         summary: 'Generador de descripciones legales concisas: Una herramienta que produce descripciones breves y concisas para resumir asuntos legales. iiresodh',
//         security: [{ ['Authorization']: [] }],
//         operationId: 'GenerarBautizoIIRESODH',
//         responses: {
//             201: {
//                 description: 'string Bautizo generado exitosamente',
//                 content: {
//                     'application/json': {
//                         schema: z.string().openapi({
//                             example: 'Bautizo generado exitosamente',
//                         }),
//                     },
//                 },
//             },
//             ...Response403,
//         },
//         request: {
//             body: {
//                 content: {
//                     'application/json': {
//                         schema: z.object({
//                             IdFineTuning: z.string(),
//                             path: z.string(),
//                             prompt: z.string().openapi({
//                                 example: input_sample,
//                             }),
//                         })
//                     },
//                 },
//                 required: true,
//             }
//         }
//     });
// };

// export type searchField_list = 'content' | 'header' | 'title';



// const BuscarJurisprudencia = (registry: OpenAPIRegistry) => {
//     const response_sample = `
// 86.	The Committees recommend that the States parties to the Conventions:

// (a)	Ensure that protection services are mandated and adequately resourced to provide all necessary prevention and protection services to children and women that are or are at high risk of becoming victims of harmful practices;
// (b)	Establish a toll-free, 24-hour hotline which is staffed by trained counsellors to enable victims to report instances when a harmful practice is likely to occur or has occurred, provide referral to needed services as well as accurate information about harmful practices;
// (c)	Develop and implement capacity-building programmes on their role in protection for judicial officers, including judges, lawyers, prosecutors and all relevant stakeholders, on legislation prohibiting discrimination and on applying laws in a gender and age-sensitive manner in conformity with the two Conventions;
// (d)	Ensure that children participating in legal processes have access to appropriate child-sensitive services to safeguard their rights and safety and to limit the possible negative impacts of the proceedings. Protective actions may include limiting the number of times a victim is required to give statements and not requiring that individual to face the perpetrator(s). Other steps may include appointing a guardian ad litem (especially where the perpetrator is a parent or legal guardian) and ensuring child victims have access to adequate child-sensitive information about the process and fully understand what to expect;
// (e)	Ensure that migrant women and children have equal access to services regardless of their legal status.
//     `;
//     // Create new order
//     registry.registerPath({
//         tags: [TAG],
//         method: 'post',
//         path: `/api/v1${API_ROUTES.digestos_search_gpt.url}`,
//         description: 'Buscador de Jurisprudencia IIRESODH: Una herramienta que retorna 25 jurisprudencia utilizando un descriptor. iiresodh',
//         summary: 'Buscador de Jurisprudencia IIRESODH: Una herramienta que retorna 25 jurisprudencia utilizando un descriptor. iiresodh',
//         security: [{ ['Authorization']: [] }],
//         operationId: 'BuscarJurisprudenciaIIRESODH',
//         responses: {
//             201: {
//                 description: 'string Bautizo generado exitosamente',
//                 content: {
//                     'application/json': {
//                         schema: responseSchema,
//                     },
//                 },
//             },
//             ...Response403,
//         },
//         request: {
//             body: {
//                 content: {
//                     'application/json': {
//                         schema: z.object({
//                             prompt: z.string().openapi({
//                                 example: 'Prevention and protection services to children and women. Prevention of harmful practices. Legislation prohibiting discrimination. Appropriate child-sensitive services to safeguard their rights. Migrant women and children. Equal access to services regardless of their legal status.',
//                             }),
//                         })
//                     },
//                 },
//                 required: true,
//             }
//         }
//     });
// };


