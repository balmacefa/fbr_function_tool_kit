// import {
//     OpenAPIRegistry,
//     extendZodWithOpenApi
// } from '@asteasolutions/zod-to-openapi';
// import { z } from 'zod';
// import { SLUGS } from '../collections/Constants';

// import { FindManyParamsSchema, InputParamsIdSchema, PaginatedResultSchema, Response403 } from './SwaggerDocs.exclude';

// extendZodWithOpenApi(z);


// const TAG = 'Users';

// export const mainDocsUsers = (registry: OpenAPIRegistry) => {
//     /*
//     Method	Path	Description
//     GET	/api/{collection-slug}	Find paginated documents
//     GET	/api/{collection-slug}/:id	Find a specific document by ID
//     POST	/api/{collection-slug}	Create a new document
//     PATCH	/api/{collection-slug}/:id	Update a document by ID
//     DELETE	/api/{collection-slug}/:id	Delete an existing document by ID
//     */
//     findMany(registry);
//     findOne(registry);
//     newOne(registry);
//     updateOne(registry);
//     deleteOne(registry);
// };



// // GET / api / { collection- slug}	Find paginated documents
// const findMany = (registry: OpenAPIRegistry) => {

//     const PaginatedResultSchemaWithDocs = registry.register(
//         `Response find - ${SLUGS.users} - json`,
//         PaginatedResultSchema.extend({
//             docs: z.array(z.object({})),
//         }));

//     const FindQuerySchema = registry.registerParameter(
//         `findMany - ${SLUGS.users}`,
//         FindManyParamsSchema
//     );

//     registry.registerPath({
//         tags: [TAG],
//         method: 'get',
//         path: `/api/v1/${SLUGS.users}`,
//         description: `Find paginated ${SLUGS.users}`,
//         summary: `Find paginated ${SLUGS.users}`,
//         security: [{ ['Authorization']: [] }],
//         responses: {
//             200: {
//                 description: `Paginated ${SLUGS.users}.`,
//                 content: {
//                     'application/json': {
//                         schema: PaginatedResultSchemaWithDocs,
//                     },
//                 },
//             },
//             ...Response403,
//         },
//         request: {
//             query: FindQuerySchema
//         }
//     });

// };


// // GET / api / { collection- slug}/:id	Find a specific document by ID
// const findOne = (registry: OpenAPIRegistry) => {

//     const DisplayResultOutputZodSchema = registry.register(
//         `Response find one - ${SLUGS.users} - json`,
//         z.object({}),
//     );

//     registry.registerPath({
//         tags: [TAG],
//         method: 'get',
//         path: `/api/v1/${SLUGS.users}/{id}`,
//         description: `Find one - ${SLUGS.users}`,
//         summary: `Find one - ${SLUGS.users}`,
//         security: [{ ['Authorization']: [] }],
//         responses: {
//             200: {
//                 description: `${SLUGS.users}.`,
//                 content: {
//                     'application/json': {
//                         schema: DisplayResultOutputZodSchema,
//                     },
//                 },
//             },
//             ...Response403,
//         },
//         request: {
//             params: InputParamsIdSchema,
//         }
//     });
// };

// // POST / api / { collection- slug}	Create a new document
// const newOne = (registry: OpenAPIRegistry) => {

//     const InputSchema = registry.register(
//         `News one - ${SLUGS.users} - Request json`,
//         z.object({}));


//     const ResultOutputZodSchema = registry.register(
//         `Response new one - ${SLUGS.users} - json`,
//         z.object({
//             doc: z.object({}),
//             message: z.string(),
//         }));

//     registry.registerPath({
//         tags: [TAG],
//         method: 'post',
//         path: `/api/v1/${SLUGS.users}`,
//         description: `Create one - ${SLUGS.users}`,
//         summary: `Create  one - ${SLUGS.users}`,
//         security: [{ ['Authorization']: [] }],
//         responses: {
//             201: {
//                 description: `New ${SLUGS.users}created.`,
//                 content: {
//                     'application/json': {
//                         schema: ResultOutputZodSchema,
//                     },
//                 },
//             },
//             ...Response403,
//         },
//         request: {
//             body: {
//                 content: {
//                     'application/json': {
//                         schema: InputSchema,
//                     },
//                 },
//                 required: true,
//             }
//         }
//     });
// };


// // PATCH	/api/{collection-slug}/:id	Update a document by ID
// const updateOne = (registry: OpenAPIRegistry) => {

//     const InputSchema = registry.register(
//         `Update one - ${SLUGS.users} - Request json`,
//         z.object({}));

//     const ResultOutputZodSchema = registry.register(
//         `Response update one - ${SLUGS.users} - json`,
//         z.object({
//             doc: z.object({}),
//             message: z.string(),
//         }));

//     registry.registerPath({
//         tags: [TAG],
//         method: 'patch',
//         path: `/api/v1/${SLUGS.users}/{id}`,
//         description: `Update one - ${SLUGS.users}`,
//         summary: `Update one - ${SLUGS.users}`,
//         security: [{ ['Authorization']: [] }],
//         responses: {
//             201: {
//                 description: `${SLUGS.users} updated.`,
//                 content: {
//                     'application/json': {
//                         schema: ResultOutputZodSchema,
//                     },
//                 },
//             },
//             ...Response403,
//         },
//         request: {
//             params: InputParamsIdSchema,
//             body: {
//                 content: {
//                     'application/json': {
//                         schema: InputSchema,
//                     },
//                 },
//                 required: true,
//             }
//         }
//     });
// };

// // DELETE	/api/{collection-slug}/:id	Delete an existing document by ID
// const deleteOne = (registry: OpenAPIRegistry) => {

//     const ResultOutputZodSchema = registry.register(
//         `Response delete one - ${SLUGS.users} - json`,
//         z.object({
//             doc: z.object({}),
//             message: z.string(),
//         }));

//     registry.registerPath({
//         tags: [TAG],
//         method: 'delete',
//         path: `/api/v1/${SLUGS.users}/{id}`,
//         description: `Delete one - ${SLUGS.users}.`,
//         summary: `Delete one - ${SLUGS.users}.`,
//         security: [{ ['Authorization']: [] }],
//         responses: {
//             201: {
//                 description: `${SLUGS.users} deleted.`,
//                 content: {
//                     'application/json': {
//                         schema: ResultOutputZodSchema,
//                     },
//                 },
//             },
//             ...Response403,
//         },
//         request: {
//             params: InputParamsIdSchema,
//         }
//     });
// };


