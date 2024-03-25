import express, { Express, NextFunction, Request, Response } from "express";
import * as http from 'http';
import { createHttpTerminator } from "http-terminator";
import IORedis from 'ioredis';
import morgan from 'morgan';
import { AddShutdown, ContainerReady, setReady } from '../../../siaj_dashboard/src/server';


export const InitExpress = async (redis_main_connection?: IORedis): Promise<Express> => {
    try {
        const app = express();
        app
            .use(morgan('dev'))
            .use(express.json());
        app.use(express.urlencoded({ extended: true }));


        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
            );
            next();
        });
        AddKubernetesEndpoints(app, redis_main_connection);

        // Error handling middleware
        app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
            console.error(err.stack); // Log error stack to console

            // Check if the environment is development for detailed error messages
            const isDevelopment = process.env.NODE_ENV === 'development';

            // Send a more detailed error message if in development, otherwise send a generic message
            if (isDevelopment) {
                res.status(500).send(`Error: ${err.message}\n${err.stack}`);
            } else {
                // In production, send a generic error message
                res.status(500).send('Something broke!');
            }
        });

        return app;

    } catch (error) /* istanbul ignore next */ {
        console.log(error);
        // ThrowError
        throw error;
    }
};

// func add Kubenertes endpoints
const AddKubernetesEndpoints = (app: Express, redis_main_connection?: IORedis) => {
    // Liveness endpoint
    app.get('/health', (req, res) => {

        if (redis_main_connection?.status === 'ready') {
            res.send('Healthy');
        } else {
            res.status(503).send('Not Healthy');
        }
        // Todo check mongo connection

    });

    // Readiness endpoint
    app.get('/ready', (req, res) => {

        if (ContainerReady && redis_main_connection?.status === 'ready') {
            res.send('Ready');
        } else {
            res.status(503).send('Not Ready');
        }
    });
};

export const regularStartup = (appExpress: Express, port_number: number): http.Server => {
    // https://stackoverflow.com/questions/70474154/why-does-specifying-the-url-as-0-0-0-0-allow-my-nestjs-fastify-app-to-deploy-t
    const server = appExpress.listen(port_number, '0.0.0.0', async () => {
        console.log("Server is running on port", port_number);
        const httpTerminatorExpress = createHttpTerminator({ server })


        AddShutdown('Express connections', async () => {
            /* Quit your redis connections here */
            console.log('/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-');
            console.log('Shutting down Express');
            await httpTerminatorExpress.terminate();
            console.log('DONE');
            console.log('/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-');
        });

        setReady();

        console.log(`🔥🚀 - Ready Worker ${process.pid}`);
    });
    return server;
};