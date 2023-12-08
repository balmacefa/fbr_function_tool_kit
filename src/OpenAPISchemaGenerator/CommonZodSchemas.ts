import { z } from "zod";
// OpenAPISchemaGenerator.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);


export class CommonZodSchemas {

    public static Response403 = {
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



    public static PaginatedResultSchema = z.object({
        docs: z.array(z.unknown()),
        totalDocs: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        page: z.number(),
        pagingCounter: z.number(),
        hasPrevPage: z.boolean(),
        hasNextPage: z.boolean(),
        prevPage: z.number(),
        nextPage: z.number(),
    });


    public static FindManyParamsSchema = z.object({
        sort: z.string().optional().openapi({
            example: 'createdAt',
            description: 'EN: sort by field - Prefix the name of the field with a minus symbol ("-") to sort in descending order.'
                + '/n' + 'ES: ordenar por campo - Prefija el nombre del campo con un símbolo de menos ("-") para ordenar en orden descendente.'

        }),
        limit: z.number().optional().openapi({
            example: 10
        }),
        page: z.number().optional().openapi({
            example: 1,
        }),
        where: z.object({}).passthrough().optional().openapi({
            param: {
                name: 'where',
            },
        }),
    }).openapi({
        param: {
            name: 'where',
            in: 'query',
            // https://dashboard.sinpay.io/api/v1/orders?locale=en&depth=0&draft=true&page=1&sort=currency&limit=25
            // style: 'form',
        },
        example: {
            sort: 'createdAt',
            limit: 10,
            page: 1,
            where: {

                'created_at': {
                    'greater_than': '2021-01-01T00:00:00.000Z',
                },

            }
        },
    });

    public static InputParamsIdSchema = z.object({
        id: z.string().openapi({
            example: '63c8ba076173e0265c6bb8a9',
        })
    });

}


