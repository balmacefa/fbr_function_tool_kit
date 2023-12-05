import type { ServerOptions } from './server/server';

export const serverConfig: ServerOptions = {
  dev: false,
  port: 5000,
  prefix: '/trpc',
};
