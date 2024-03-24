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

export class APIInitializer {
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
        const serviceName = service.constructor.name.toLowerCase();
        Object.keys(service).forEach((methodName) => {
            const routePath = `/${serviceName}/${methodName}`;

            // if methodName starts with "get" then use GET method, otherwise use POST method
            const methodType = methodName.startsWith("get") ? 'get' : 'post';

            console.log(`Creating route ${methodType} ${routePath}`);

            router[methodType](routePath, async (req: Request, res: Response) => {
                try {
                    const result = await service[methodName]();
                    res.json(result);
                } catch (error) {
                    console.error(error);
                    res.status(500).send("Internal Server Error");
                }
            });

        });
    }
}


export abstract class ExpedienteColombiaService extends IService {
    abstract get_cache_docs_page_01_colombia(): Promise<any>;
    abstract get_cache_docs_page_02_colombia(): Promise<any>;
}



export class ExpedienteColombiaServiceImplementation extends ExpedienteColombiaService {
    async get_cache_docs_page_01_colombia() {
        return 11;
    }

    async get_cache_docs_page_02_colombia() {
        return `get_docs_page_by_dev_code_ref('page_02_colombia');`
    }

}




// Utility function to convert method names to URLs
const methodNameToURL = (methodName: string): string => {
    // Implement conversion logic here. This is a placeholder.
    // For example: get_cache_docs_page_01_colombia -> /docs/page/01/colombia
    return `/api/${methodName.replace(/_/g, '/')}`;
};


export class AutoAxiosService {
    constructor(private baseUrl: string) { }

    createService<T extends IService>(ServiceClass: new (...args: any[]) => T): T {
        const instance = new ServiceClass();

        return new Proxy(instance, {
            get: (target, propKey, receiver) => {
                // Ensure propKey is a string before proceeding
                if (typeof propKey === 'string') {
                    const originalMethod = target[propKey];
                    if (typeof originalMethod === 'function' && propKey.startsWith('get')) {
                        return async (...args: any[]) => {
                            const urlPath = propKey.replace(/_/g, '/').toLowerCase();
                            const url = `${this.baseUrl}/${urlPath}`;
                            try {
                                const response = await axios.get(url, { params: args[0] });
                                return response.data;
                            } catch (error) {
                                console.error(`Axios request failed for ${url}: ${error}`);
                                throw error;
                            }
                        };
                    }
                }
                // For symbols or non-matching properties, fallback to the default behavior
                return Reflect.get(target, propKey, receiver);
            },
        }) as T;
    }
}





// f main fle is executed here
if (require.main === module) {
    const app = express();
    const service = new ExpedienteColombiaServiceImplementation();

    const apiInitializer = new APIInitializer(app, [service]);
    apiInitializer.initializeJSON_API();

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });

    const autoAxiosService = new AutoAxiosService('http://example.com');
    const expedienteService = autoAxiosService.createService(ExpedienteColombiaServiceImplementation);
    // Now you can call methods, and they will automatically make Axios requests
    const service_result = await expedienteService.get_cache_docs_page_01_colombia();
}
