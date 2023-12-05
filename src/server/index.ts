import { serverConfig } from '../config';
import { createServer } from './server';

if (typeof module === "undefined") {
    console.log('running directly 1');
    const server = createServer(serverConfig);

    void server.start();


    // check if we're running this file directly
}