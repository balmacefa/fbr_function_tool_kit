import axios from "axios";
import { AutoAxiosService } from "./ServerClientAPI";




class TestService {
    getMethod1(params: any): Promise<any> {
        return Promise.resolve();
    }

    getMethod2(params: any): Promise<any> {
        return Promise.resolve();
    }
}

jest.mock("axios");

describe('AutoAxiosService', () => {
    const baseUrl = "http://example.com";
    let autoAxiosService: AutoAxiosService;

    beforeEach(() => {
        autoAxiosService = new AutoAxiosService(baseUrl);
    });

    describe('createService', () => {
        it('should return a proxy object with GET methods', () => {
            const service = autoAxiosService.createService(TestService);
            expect(service).toBeDefined();
            expect(typeof service.getMethod1).toBe('function');
            expect(typeof service.getMethod2).toBe('function');
        });

        it('should call axios.get with the correct URL and params', async () => {
            const service = autoAxiosService.createService(TestService);
            const params = { id: 1 };
            const responseData = { result: 'success' };
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

            const result = await service.getMethod1(params);

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/testservice/getmethod1`, { params });
            expect(result).toEqual(responseData);
        });

        it('should throw an error if axios.get fails', async () => {
            const service = autoAxiosService.createService(TestService);
            const params = { id: 1 };
            const error = new Error('Request failed');
            (axios.get as jest.Mock).mockRejectedValueOnce(error);

            await expect(service.getMethod1(params)).rejects.toThrowError(error);
            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/testservice/getmethod1`, { params });
        });
    });
});



// describe('APIInitializer', () => {
//     let app: Express;
//     let initializer: APIInitializer;

//     beforeEach(() => {
//         app = express();
//         initializer = new APIInitializer(app, [], "/api_json_rpc");
//     });

//     describe('initializeJSON_API', () => {
//         it('should create routes and set up the middleware correctly', () => {
//             const router = initializer.initializeJSON_API();
//             expect(app.use).toHaveBeenCalledWith("/api_json_rpc", router);
//         });
//     });

//     describe('createRoutes', () => {
//         it('should create routes for each service', () => {
//             const service1 = { constructor: { name: "Service1" } };
//             const service2 = { constructor: { name: "Service2" } };
//             initializer.services = [service1, service2];

//             const router = initializer.createRoutes();
//             expect(router.get).toHaveBeenCalledWith('/service1/getMethod1', expect.any(Function));
//             expect(router.post).toHaveBeenCalledWith('/service1/postMethod1', expect.any(Function));
//             expect(router.get).toHaveBeenCalledWith('/service2/getMethod2', expect.any(Function));
//             expect(router.post).toHaveBeenCalledWith('/service2/postMethod2', expect.any(Function));
//         });
//     });

//     describe('createRoutesForService', () => {
//         it('should create routes for each method of the service', () => {
//             const service = {
//                 constructor: { name: "Service" },
//                 getMethod1: jest.fn(),
//                 postMethod1: jest.fn(),
//             };
//             const router = express.Router();
//             initializer.createRoutesForService(service, router);

//             expect(router.get).toHaveBeenCalledWith('/service/getMethod1', expect.any(Function));
//             expect(router.post).toHaveBeenCalledWith('/service/postMethod1', expect.any(Function));
//         });
//     });

//     describe('printRoutes', () => {
//         it('should print the route information for each created route', () => {
//             initializer.routeInfo = [
//                 'Creating route get /service1/getMethod1',
//                 'Creating route post /service1/postMethod1',
//                 'Creating route get /service2/getMethod2',
//                 'Creating route post /service2/postMethod2',
//             ];

//             const consoleSpy = jest.spyOn(console, 'log');
//             initializer.printRoutes();

//             expect(consoleSpy).toHaveBeenCalledWith('All created routes:');
//             expect(consoleSpy).toHaveBeenCalledWith('Creating route get /service1/getMethod1');
//             expect(consoleSpy).toHaveBeenCalledWith('Creating route post /service1/postMethod1');
//             expect(consoleSpy).toHaveBeenCalledWith('Creating route get /service2/getMethod2');
//             expect(consoleSpy).toHaveBeenCalledWith('Creating route post /service2/postMethod2');
//         });
//     });
// });
