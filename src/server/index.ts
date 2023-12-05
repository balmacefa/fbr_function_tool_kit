import { serverConfig } from '../config';
import { createServer } from './server';

if (typeof module === "undefined") {
    (async () => {
        console.log('running directly 1');
        const server = await createServer(serverConfig);

        void server.start();
    })();

    // check if we're running this file directly
}