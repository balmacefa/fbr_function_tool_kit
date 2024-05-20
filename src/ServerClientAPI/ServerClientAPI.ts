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

    | T
    | string
    | { success: MaybePromise<T>; error?: never }
    | { success?: never; error: string };

export class APIInitializer {
    private routeInfo: string[] = []; // Agregar una propiedad para hacer un seguimiento de la información de las rutas

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
        const parentClassName = Object.getPrototypeOf(service).constructor.name;
        const servicePrototype = Object.getPrototypeOf(service);

        const allKeys = new Set([
            ...Object.getOwnPropertyNames(servicePrototype) // Llaves del prototipo
        ]);

        allKeys.forEach((methodName) => {
            if (typeof service[methodName] === 'function' && methodName !== 'constructor') {
                const routePath = `/${parentClassName}/${methodName}`;
                const methodType = methodName.startsWith("get") ? 'get' : 'post';

                this.routeInfo.push(`Creating route ${methodType} ${routePath}`);

                router[methodType](routePath, async (req: Request, res: Response) => {
                    try {
                        console.log(`Calling ${methodName} with params: ${JSON.stringify(req.query)}`);

                        const url_axios_params = req.query;

                        if (Object.keys(url_axios_params).length > 0) {
                            const result = await service[methodName](url_axios_params);
                            res.json(result);
                            return;
                        } else {
                            const result = await service[methodName]();
                            res.json(result);
                        }
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
        this.routeInfo.forEach((info) => console.log(info)); // Imprimir cada información de ruta
    }
}

type error_handler_types = 'data_error' | 'throw_error' | 'error_as_string';

export class AutoAxiosService {
    constructor(private baseUrl: string, private error_handler: error_handler_types = 'data_error') { }

    createService<T extends IService>(ServiceClass: new (...args: any[]) => T) {
        const instance = new ServiceClass();

        return new Proxy(instance, {
            get: (target, propKey, receiver) => {
                if (typeof propKey === 'string') {
                    const originalMethod = target[propKey];
                    if (typeof originalMethod === 'function' && propKey.startsWith('get')) {

                        return async (...args: any[]): Promise<Data_OR_ERROR<T>> => {
                            const serviceName = instance.constructor.name.toLowerCase();
                            const methodType = propKey.startsWith("get") ? 'get' : 'post';

                            const url = `${this.baseUrl}/${serviceName}Implementation/${propKey}`;
                            console.log(`Making Axios request to ${url}`);
                            try {
                                let params = {};
                                if (args.length > 0 && typeof args[0] === 'object') {
                                    params = args[0];
                                }
                                const response = await axios[methodType](url, { params });

                                if (this.error_handler === 'data_error') {
                                    return {
                                        success: response.data,
                                    };
                                } else {
                                    return response.data;
                                }
                            } catch (error) {
                                console.error(`Axios request failed for ${url}: ${error}`);

                                if (this.error_handler === 'throw_error') {
                                    throw new Error(`Axios request failed for ${url}: ${error}`);
                                }

                                if (this.error_handler === 'data_error') {
                                    return {
                                        error: `Axios request failed for ${url}: ${error}`,
                                    };
                                }
                                if (this.error_handler === 'error_as_string') {
                                    return `Axios request failed for ${url}: ${error}`;
                                }
                                return '';
                            }
                        }
                    }
                }
                return Reflect.get(target, propKey, receiver);
            },
        });
    }
}
