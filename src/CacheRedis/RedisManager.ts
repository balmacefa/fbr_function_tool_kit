// import { ioRedisStore, RedisCache } from "@tirke/node-cache-manager-ioredis";
// import { caching } from 'cache-manager';
// import IORedis from "ioredis";
// import { toNumber } from "lodash";

// export let RCache: RedisCache;

// export const RedisConnection = async (): Promise<IORedis> => /* istanbul ignore next */ {
//     const port = process.env.REDIS_PORT;
//     if (!port) throw new Error("REDIS_PORT env variable is required");
//     const host = process.env.REDIS_HOST;
//     if (!host) throw new Error("REDIS_HOST env variable is required");
//     const password = process.env.REDIS_PASSWORD;
//     if (!password) throw new Error("REDIS_PASSWORD env variable is required");
//     const username = process.env.REDIS_USER;
//     if (!username) throw new Error("REDIS_USER env variable is required");

//     console.log(`Redis connecting to ${host}:${port}`);
//     // hide all but first and last 3 characters of password
//     const passwordHidden = `${password.slice(0, 3)}****${password.slice(-3)}`;

//     console.log(`Redis connecting with user ${username} and password ${passwordHidden}`);

//     const redisCon = new IORedis(toNumber(port), host, {
//         host,
//         password,
//         username,
//         maxRetriesPerRequest: null,
//         enableReadyCheck: false
//     });


//     redisCon.on("connect", () => {
//         console.log(`Redis connected`);
//     });

//     redisCon.on("error", (err) => {
//         console.log(`Redis error`, err);
//     });

//     redisCon.on("close", () => {
//         console.log(`Redis close`);
//     });

//     redisCon.on("reconnecting", () => {
//         console.log(`Redis reconnecting`);
//     });

//     redisCon.on("end", () => {
//         console.log(`Redis end`);
//     });

//     return new Promise((resolve, reject) => {
//         redisCon.on("ready", () => {
//             console.log(`Redis ready`);
//             resolve(redisCon);
//         });

//         redisCon.on("error", (err) => {
//             console.log(`Redis error`, err);
//             reject(err);
//         });
//     });
// }


// export const SetRedisCacheManager = async (redis_main_connection: IORedis) => {
//     RCache = await caching(ioRedisStore({
//         // redisInstance: redisCon.main,
//         // ts-ignore
//         // @ts-ignore
//         redisInstance: redis_main_connection,
//         ttl: 3600 * 24 * 1000,
//         //     ttl: 3600 * 24 * 1000 /*miliseconds*/,
//         //     // 1 day = 86400 seconds
//         //     // 1 hour = 3600 seconds
//         //     // 1 minute = 60 seconds
//         //     // 1 second = 1 seconds
//     }));
// };


// // export async function InitServer(redis_main_connection: IORedis, app: Express, server: http.Server, start_server: boolean) {
// //     redis_main_connection = new RedisMock();
// //     redis_main_connection.status = 'ready';
// // }

// export const SetCache = async (req: Request, doc: any, redisCachekey: string, ttl_arg?: number) => {
//     if (get(req, 'user.INTERNAL_CACHE_REQUEST', false)) {
//         await RCache.del(redisCachekey);
//         return doc;
//     }

//     // After a document is created or updated, the afterChange hook runs.T
//     // remove cache
//     let ttl = 6 * 60; // 6 min
//     if (ttl_arg) {
//         ttl = ttl_arg
//     }
//     await RCache.del(redisCachekey);
//     await RCache.wrap<any>(redisCachekey, async () => doc, ttl);
//     return doc;
// };

// export const RemoveCache = (redisCachekey: (arg0: any) => any) => {

//     const _RemoveCache: AfterChangeHook = async ({
//         req, // full express request
//         operation, // name of the operation ie. 'create', 'update'
//         doc,
//     }): Promise<void> => {
//         // After a document is created or updated, the afterChange hook runs.
//         // remove cache
//         const key = redisCachekey(doc);
//         await RCache.del(key);
//     }
//     return _RemoveCache;
// };

// export const findByIDCacheHandler = (redisCachekey: (arg0: any) => any, ttl_arg?: number) => {

//     const _findByIDCacheHandler: PayloadHandler = async (req, res, next) => {
//         const key = redisCachekey(req);
//         let ttl = 6 * 60; // 6 min
//         if (ttl_arg) {
//             ttl = ttl_arg
//         }
//         set(req, 'user.INTERNAL_CACHE_REQUEST', true);

//         const cached = await RCache.wrap<any>(key, async () => {

//             try {
//                 const doc = await findByID({
//                     req,
//                     collection: <Collection>req.collection,
//                     id: req.params.id,
//                     depth: Number(req.query.depth),
//                     draft: req.query.draft === 'true',
//                 });
//                 return doc;
//             }
//             catch (error) {
//                 return next(error);
//             }
//         }, ttl);

//         return res.json(cached);

//     };
//     return _findByIDCacheHandler;
// };





// import { ioRedisStore, RedisCache } from "@tirke/node-cache-manager-ioredis";
// import { caching } from 'cache-manager';
// import IORedis from "ioredis";
// import { toNumber } from "lodash";
// import { Request } from 'express';

// interface ILifecycle {
//     init(): Promise<void>;
//     onUpdate(): void;
//     onGui(): void;
// }

// export class RedisManager implements ILifecycle {
//     private static instance: RedisManager;
//     private redisConnection: IORedis;
//     public cache: RedisCache;

//     // Private constructor to prevent direct class instantiation
//     private constructor() {
//         this.redisConnection = null;
//         this.cache = null;
//     }

//     // Singleton instance access method
//     public static getInstance(): RedisManager {
//         if (!RedisManager.instance) {
//             RedisManager.instance = new RedisManager();
//         }
//         return RedisManager.instance;
//     }

//     // ILifecycle implementation
//     async init(): Promise<void> {
//         await this.connectRedis();
//         await this.initializeCache();
//     }

//     onUpdate(): void {
//         // Implementation of the onUpdate lifecycle method
//     }

//     onGui(): void {
//         // Implementation of the onGui lifecycle method
//     }

//     connectRedis(): Promise<IORedis> {
//         const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_USER } = process.env;
//         if (!REDIS_PORT || !REDIS_HOST || !REDIS_PASSWORD || !REDIS_USER) {
//             throw new Error("Redis environment variables are required");
//         }

//         console.log(`Redis connecting to ${REDIS_HOST}:${REDIS_PORT}`);
//         const passwordHidden = `${REDIS_PASSWORD.slice(0, 3)}****${REDIS_PASSWORD.slice(-3)}`;
//         console.log(`Redis connecting with user ${REDIS_USER} and password ${passwordHidden}`);

//         this.redisConnection = new IORedis(toNumber(REDIS_PORT), REDIS_HOST, {
//             host: REDIS_HOST,
//             password: REDIS_PASSWORD,
//             username: REDIS_USER,
//             maxRetriesPerRequest: null,
//             enableReadyCheck: false
//         });

//         this.setupRedisEvents();
//         return new Promise((resolve, reject) => {
//             this.redisConnection.on("ready", () => {
//                 console.log(`Redis ready`);
//                 resolve(this.redisConnection);
//             });

//             this.redisConnection.on("error", (err) => {
//                 console.log(`Redis error`, err);
//                 reject(err);
//             });
//         });
//     }

//     private setupRedisEvents() {
//         const events = ["connect", "error", "close", "reconnecting", "end"];
//         events.forEach(event => {
//             this.redisConnection.on(event, () => console.log(`Redis ${event}`));
//         });
//     }

//     async initializeCache(): Promise<void> {
//         this.cache = await caching(ioRedisStore({
//             redisInstance: this.redisConnection,
//             ttl: 3600 * 24 * 1000 // 1 day in milliseconds
//         }));
//     }

//     async setCache(doc: any, redisCachekey: string, ttl: number = 6 * 60): Promise<any> {

//         await this.cache.del(redisCachekey);
//         await this.cache.wrap<any>(redisCachekey, async () => doc, ttl);
//         return doc;
//     }

//     async removeCache(redisCachekey: string): Promise<void> {
//         await this.cache.del(redisCachekey);
//     }
//     // Other methods remain the same as in the previous example

//     // ... (connectRedis, initializeCache, setCache, removeCache, etc.)

//     // Other methods (RemoveCache, findByIDCacheHandler) go here...
// }

// // Usage example:
// // const redisManager = RedisManager.getInstance();
// // await redisManager.init();
