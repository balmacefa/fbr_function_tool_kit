import { ioRedisStore, RedisCache } from "@tirke/node-cache-manager-ioredis";
import { caching } from 'cache-manager';
import IORedis from "ioredis";
import { toNumber } from "lodash";

export let RCache: RedisCache;

export const RedisConnection = async (): Promise<IORedis> => /* istanbul ignore next */ {
    const port = process.env.REDIS_PORT;
    if (!port) throw new Error("REDIS_PORT env variable is required");
    const host = process.env.REDIS_HOST;
    if (!host) throw new Error("REDIS_HOST env variable is required");
    const password = process.env.REDIS_PASSWORD;
    if (!password) throw new Error("REDIS_PASSWORD env variable is required");
    const username = process.env.REDIS_USER;
    if (!username) throw new Error("REDIS_USER env variable is required");

    console.log(`Redis connecting to ${host}:${port}`);
    // hide all but first and last 3 characters of password
    const passwordHidden = `${password.slice(0, 3)}****${password.slice(-3)}`;

    console.log(`Redis connecting with user ${username} and password ${passwordHidden}`);

    const redisCon = new IORedis(toNumber(port), host, {
        host,
        password,
        username,
        maxRetriesPerRequest: null,
        enableReadyCheck: false
    });


    redisCon.on("connect", () => {
        console.log(`Redis connected`);
    });

    redisCon.on("error", (err) => {
        console.log(`Redis error`, err);
    });

    redisCon.on("close", () => {
        console.log(`Redis close`);
    });

    redisCon.on("reconnecting", () => {
        console.log(`Redis reconnecting`);
    });

    redisCon.on("end", () => {
        console.log(`Redis end`);
    });

    return new Promise((resolve, reject) => {
        redisCon.on("ready", () => {
            console.log(`Redis ready`);
            resolve(redisCon);
        });

        redisCon.on("error", (err) => {
            console.log(`Redis error`, err);
            reject(err);
        });
    });
}


export const SetRedisCacheManager = async (redis_main_connection: IORedis) => {
    RCache = await caching(ioRedisStore({
        redisInstance: redis_main_connection,
        ttl: 3600 * 24 * 1000,
        //     ttl: 3600 * 24 * 1000 /*miliseconds*/,
        //     // 1 day = 86400 seconds
        //     // 1 hour = 3600 seconds
        //     // 1 minute = 60 seconds
        //     // 1 second = 1 seconds
    }));
};
