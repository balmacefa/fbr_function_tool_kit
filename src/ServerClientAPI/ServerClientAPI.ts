import axios from 'axios';
import express, { Express, Request, Response } from 'express';


const auto_gen = `

// This code is auto-generated, do not modify!! use the dashboard to make changes.
export type PaginatedDocs<T = any> = {
    docs: T[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage?: null | number | undefined;
    page?: number;
    pagingCounter: number;
    prevPage?: null | number | undefined;
    totalDocs: number;
    totalPages: number;
};

// server/myService.ts
export abstract class IService {
    [key: string]: any; // This is an index signature
}
// This code is auto-generated, do not modify!! use the dashboard to make changes.
`;


export class IService {
    [key: string]: any; // This is an index signature
}

export type MaybePromise<TType> = Promise<TType> | TType;

export type HTML_OR_ERROR =
    | { success: string; error?: never }
    | { success?: never; error: string };


export type MaybePromise_OR_ERROR<T> =
    | { success: MaybePromise<T>; error?: never }
    | { success?: never; error: string };

// Promse or Error
export type Promise_OR_ERROR<T> =
    | { success: Promise<T>; error?: never }
    | { success?: never; error: string };
export type Data_OR_ERROR<T = any> =
    | { success: MaybePromise<T>; error?: never }
    | { success?: never; error: string };

export class APIInitializer {
    private routeInfo: string[] = []; // Add a property to keep track of route info

    constructor(private app: Express, private services: IService[], private api_json_rpc_prefix?: string) { }

    initializeJSON_API() {
        const router = this.createRoutes();
        this.app.use(this.api_json_rpc_prefix || "/api_json_rpc", router);
    }

    private createRoutes(): express.Router {
        const router = express.Router();
        this.services.forEach((service) => this.createRoutesForService(service, router));
        return router;
    }

    private createRoutesForService(service: IService, router: express.Router) {
        // const serviceName = service.constructor.name.toLowerCase();
        const parentClassName = Object.getPrototypeOf(service).constructor.name;
        const servicePrototype = Object.getPrototypeOf(service);

        // Combine both own keys and prototype keys, filter out non-function properties and constructor
        const allKeys = new Set([
            ...Object.getOwnPropertyNames(servicePrototype) // prototype keys
        ]);

        allKeys.forEach((methodName) => {
            if (typeof service[methodName] === 'function' && methodName !== 'constructor') {
                const routePath = `/${parentClassName}/${methodName}`;
                const methodType = methodName.startsWith("get") ? 'get' : 'post';

                this.routeInfo.push(`Creating route ${methodType} ${routePath}`);

                router[methodType](routePath, async (req: Request, res: Response) => {
                    try {
                        const result = await service[methodName]();
                        res.json(result);
                    } catch (error) {
                        console.error(error);
                        res.status(500).send("Internal Server Error");
                    }
                });
            }
        });
    }


    public printRoutes() {
        console.log("All created routes:");
        this.routeInfo.forEach((info) => console.log(info)); // Print each route information
    }
}


export class AutoAxiosService {
    constructor(private baseUrl: string) { }

    createService<T extends IService>(ServiceClass: new (...args: any[]) => T) {
        const instance = new ServiceClass();

        return new Proxy(instance, {
            get: (target, propKey, receiver) => {
                // Ensure propKey is a string before proceeding
                if (typeof propKey === 'string') {
                    const originalMethod = target[propKey];
                    if (typeof originalMethod === 'function' && propKey.startsWith('get')) {

                        return async (...args: any[]): Promise<Data_OR_ERROR<T>> => {


                            const serviceName = instance.constructor.name.toLowerCase(); // Declare the 'serviceName' variable
                            const methodType = propKey.startsWith("get") ? 'get' : 'post';

                            const url = `${this.baseUrl}/${serviceName}Implementation/${propKey}`;
                            console.log(`Making Axios request to ${url}`);
                            try {
                                const response = await axios[methodType](url, { params: args[0] });
                                return {
                                    success: response.data,
                                };
                            } catch (error) {
                                console.error(`Axios request failed for ${url}: ${error}`);

                                return {
                                    error: `Axios request failed for ${url}: ${error}`,
                                };
                            }
                        };
                    }
                }
                // For symbols or non-matching properties, fallback to the default behavior
                return Reflect.get(target, propKey, receiver);
            },
        });
    }
}
