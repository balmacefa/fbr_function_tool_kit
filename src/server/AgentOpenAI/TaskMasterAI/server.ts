import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import ws from '@fastify/websocket';
// import fastify_open_api from '@scalar/fastify-api-reference';
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateFastifyContextOptions, fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify, { FastifyInstance } from "fastify";
import fs from 'fs';
import superjson from 'superjson';
import { AssistantsAPIBaseManager } from './AssistantManager/AssistantsManager';
import { TaskMasterAI } from "./TaskMasterAgent";

export interface User {
    name: string[] | string;
}

export function createContext({ req, res }: CreateFastifyContextOptions) {
    const user: User = { name: req.headers.username ?? 'anonymous' };

    return { req, res, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;

export interface ServerOptions {
    dev: boolean;
    port: number;
    prefix: string;
}


const create_server_trpc = async (opts: ServerOptions, tthis: TaskMasterAI) => {
    const { dev, port, prefix } = opts;

    const server = fastify({ logger: dev });

    void server.register(ws); // WebSocket configuration should be defined here

    const t = initTRPC.context<Context>().create({
        transformer: superjson,
        errorFormatter({ shape }) {
            return shape;
        },
    });

    let appRouter = t.router({});

    tthis.tool_map.forEach((tool, tool_name) => {
        const route = tool.get_trpc_route();
        appRouter = t.mergeRouters(route);
    });

    void server.register(fastifyTRPCPlugin, {
        prefix,
        useWSS: true,
        trpcOptions: {
            router: appRouter,
            createContext
        },
    });

    server.get('/', async () => {
        // Export all the routes
        const routes = server.printRoutes();
        return { hello: 'wait-on', routes };
    });




    await GenerateOpenAPI(tthis, server);


    const stop = async () => {
        await server.close();
    };
    const start = async () => {
        try {
            await server.listen({ port });
            console.log('listening on port', port);
            console.log('routes', server.printRoutes());
        } catch (err) {
            server.log.error(err);
            process.exit(1);
        }
    };

    return { server, start, stop };
}


// check if we're running this file directly
if (typeof module === "undefined") {

    // self executing async function here
    (async () => {
        const tthis = await TaskMasterAI.instance();
        const server = await create_server_trpc({ dev: true, port: 3000, prefix: '/api/trpc' }, tthis);
        await server.start();
    })();
}

async function GenerateOpenAPI(tthis: TaskMasterAI, server: FastifyInstance) {
    const registry = new OpenAPIRegistry();

    tthis.tool_map.forEach((tool, tool_name) => {
        tool.get_openapi_schema(registry);
        tool.set_fastify_route(server);
    });

    await AssistantsAPIBaseManager.get_instance().set_fastify_routes(server, registry);


    const generator = new OpenApiGeneratorV3(registry.definitions);
    const docs = generator.generateDocument({
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'My API',
            // description: 'Base URL: https://iiresodh-siaj.onrender.com/',
        },
        servers: [
            // { url: 'https://iiresodh-siaj.onrender.com' },
            { url: 'http://localhost:3000' }
        ], // Set the base URL for your API
    });

    // save the docs to a file .json

    fs.writeFileSync('./docs.json', JSON.stringify(docs, null, 2));


    server.get('/docs.json', async (request, reply) => {
        reply.send(docs);
    });

    // // server.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));
    // server.register(fastify_open_api, {
    //     routePrefix: '/doc',
    //     apiReference: {
    //         pageTitle: 'Our API Reference',
    //         spec: {
    //             url: '/docs.json',
    //         },
    //     },
    // });
}
