import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { appRouter } from './router';
import { createContext } from './router/context';

export interface ServerOptions {
  dev: boolean;
  port: number;
  prefix: string;
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev;
  const port = opts.port;
  const prefix = opts.prefix;

  const server = fastify({ logger: dev });

  void server.register(ws);
  void server.register(fastifyTRPCPlugin, {
    prefix,
    useWSS: true,
    trpcOptions: { router: appRouter, createContext },
  });

  server.get('/', async () => {
    return { hello: 'wait-on 💨' };
  });

  const stop = async () => {
    await server.close();
  };
  const start = async () => {
    try {
      await server.listen({ port });
      console.log('listening on port', port);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}


// check if we're running this file directly
if (typeof module === "undefined") {
  console.log('running directly 2');
}