import {
    OpenAPIRegistry,
    OpenApiGeneratorV3,
    extendZodWithOpenApi
} from '@asteasolutions/zod-to-openapi';
// import swaggerUi from "swagger-ui-express";
import { z } from 'zod';
// import { mainChatGPTActions } from './ChatGPTActions';

extendZodWithOpenApi(z);

export const Response403 = {
    403: {
        description: 'Error: not allowed to perform this action',
        content: {
            'application/json': {
                // base on schema: {
                //     "errors": [
                //         {
                //             "message": "You are not allowed to perform this action."
                //         }
                //     ]
                // }
                // return a zod schema
                schema: z.object({
                    errors: z.array(
                        z.object({
                            message: z.string(),
                        })
                    ),
                }).openapi(
                    {
                        example: {
                            errors: [
                                {
                                    message: 'You are not allowed to perform this action.',
                                },
                            ],
                        }
                    }
                ),
            },
        },
    }
};

// export const PaginatedResultSchema = z.object({
//     docs: z.array(z.unknown()),
//     totalDocs: z.number(),
//     limit: z.number(),
//     totalPages: z.number(),
//     page: z.number(),
//     pagingCounter: z.number(),
//     hasPrevPage: z.boolean(),
//     hasNextPage: z.boolean(),
//     prevPage: z.number(),
//     nextPage: z.number(),
// });


// export const FindManyParamsSchema = z.object({
//     sort: z.string().optional().openapi({
//         example: 'createdAt',
//         description: 'EN: sort by field - Prefix the name of the field with a minus symbol ("-") to sort in descending order.'
//             + '/n' + 'ES: ordenar por campo - Prefija el nombre del campo con un símbolo de menos ("-") para ordenar en orden descendente.'

//     }),
//     limit: z.number().optional().openapi({
//         example: 10
//     }),
//     page: z.number().optional().openapi({
//         example: 1,
//     }),
//     where: z.object({}).passthrough().optional().openapi({
//         param: {
//             name: 'where',
//         },
//     }),
// }).openapi({
//     param: {
//         name: 'where',
//         in: 'query',
//         // https://dashboard.sinpay.io/api/v1/orders?locale=en&depth=0&draft=true&page=1&sort=currency&limit=25
//         // style: 'form',
//     },
//     example: {
//         sort: 'createdAt',
//         limit: 10,
//         page: 1,
//         where: {

//             'created_at': {
//                 'greater_than': '2021-01-01T00:00:00.000Z',
//             },

//         }
//     },
// });

// export const InputParamsIdSchema = z.object({
//     id: z.string().openapi({
//         example: '63c8ba076173e0265c6bb8a9',
//     })
// });

export function getOpenApiDocumentation() {

    const registry = new OpenAPIRegistry();


    const bearerAuth = registry.registerComponent('securitySchemes', 'Authorization', {
        type: 'apiKey',
        // scheme: 'bearer',
        // bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'apps API-Key ${token}. Example: apps API-Key b70bedaf-3349-4aca-ae53-1ad8afcd9f1c',
    });


    // TODO: Create a static func, to auto register route and filter base on tags[]
    // add Routes
    // mainChatGPTActions(registry);
    // mainDocsApps(registry);
    // mainDocsUsers(registry);
    // mainDocsOrganizations(registry);
    // mainDocsStaticQr(registry);
    // mainDocsSmsListener(registry);


    const generator = new OpenApiGeneratorV3(registry.definitions);

    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'My API',
            description: 'Base URL: https://iiresodh-siaj.onrender.com/',

        },
        servers: [
            { url: 'https://iiresodh-siaj.onrender.com' },

            // { url: 'http://localhost:5000' }
        ], // Set the base URL for your API
    });
}


// This code serves the Swagger UI page and the Swagger JSON document. It is used
// to display the Swagger documentation for the API.
// export async function DisplaySwaggerDocs(app: Express) {

//     try {
//         const SwaggerSpec = await getOpenApiDocumentation();
//         // app.use("/docs", swaggerUi.serve);
//         // app.get("/docs", (req: Request, res: Response) => {
//         //     swaggerUi.setup(SwaggerSpec)(req, res, () => {
//         //         res.status(404).send("Not found");
//         //     });
//         // });

//         app.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));

//         // Serve the Swagger JSON document
//         app.get("/open_api.json", (req: Request, res: Response) => {
//             res.setHeader("Content-Type", "application/json");
//             res.send(SwaggerSpec);
//         });
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
//     // Serve the Swagger UI page
// }

// TODO: create func to save file open_api.json
