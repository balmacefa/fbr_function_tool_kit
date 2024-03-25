// import { QueueOptions, WorkerOptions } from "bullmq";
// import IORedis from 'ioredis';
// import { Payload } from "payload";
// import { EmbeddingIndexInstance } from "../../AI_Tools/EmbeddingIndex.exclude";
// import { type__indexer } from "../../TYPES/global_type";
// import { SLUGS, SuperQueueNames } from "../../collections/Constants";
// import { SuperQueue, TickFuncType } from "../../servers/utils/SuperQueue";

// export class IndexerQueue {


//     // Static instance of the class
//     private static instance: IndexerQueue;

//     // Static method to get the instance of the class
//     public static createInstance(payload: Payload, redis_main_connection: IORedis): IndexerQueue {
//         if (!IndexerQueue.instance) {
//             IndexerQueue.instance = new IndexerQueue(payload, redis_main_connection);
//         }
//         return IndexerQueue.instance;
//     }
//     // get the instance of the class, throw error if not created
//     public static getInstance(): IndexerQueue {
//         if (!IndexerQueue.instance) {
//             throw new Error('NotifyCenter instance not created');
//         }
//         return IndexerQueue.instance;
//     }
//     // return NotifyCenter.getInstance().NotifyOrderUpdate(order);

//     public payload: Payload;
//     public superQueue: SuperQueue;
//     public maxAttempts = 200;
//     public maxAttemptsTo15Minutes = 96;

//     constructor(payload: Payload, redis_main_connection: IORedis) {
//         this.payload = payload;

//         // https://github.com/taskforcesh/bullmq/blob/bc533ca119600f92caca020dd280c1011e849417/docs/gitbook/api/bullmq.jobsoptions.md
//         const queueOptions = <QueueOptions>
//             {
//                 defaultJobOptions: {
//                     attempts: this.maxAttempts,
//                     backoff: {
//                         type: 'backoffStrategy',
//                         delay: 618,
//                     },
//                     removeOnComplete: true,
//                     removeOnFail: false,
//                 },
//             };
//         const workerSettings: WorkerOptions = {
//             settings: {
//                 backoffStrategy: (attemptsMade?: number, type?: string, err?: Error) => {
//                     // console.log(attemptsMade, type, err);
//                     if (!attemptsMade) {
//                         return 1;
//                     }
//                     // first 5 attempts, return exponential backoff
//                     // With an exponential backoff, it will retry after 2 ^ (attempts - 1) * delay milliseconds.
//                     if (attemptsMade <= 11) {
//                         // in seconds: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024
//                         // in minutes: 0.016, 0.033, 0.067, 0.133, 0.267, 0.533, 1.067, 2.133, 4.267, 8.533, 17.067
//                         return 2 ** (attemptsMade - 1) * 1000;
//                     } else if (attemptsMade <= this.maxAttemptsTo15Minutes) {
//                         // every 15 minutes, to get upto 24 hours we need this many attempts
//                         return 15 * 60 * 1000;
//                     } else {
//                         // every 30 minutes, to get upto 48 hours we need this many attempts
//                         return 30 * 60 * 1000;
//                     }
//                 }
//             }
//         };

//         this.superQueue = new SuperQueue(SuperQueueNames.QueueNameNotifyOrderUpdateWebhook,
//             redis_main_connection,
//             this.runner,
//             { queueOptions, workerSettings }
//         );
//     }

//     private removeDigestos_uuid = async (data: type__indexer) => {
//         return await this.payload.delete({
//             collection: SLUGS.Digestos,
//             where: {
//                 // required
//                 uuid: { equals: data.uuid },
//             },
//             overrideAccess: true,
//         });
//     }


//     /**
//      * runner
//      */
//     private runner: TickFuncType = async (job) => {
//         // Your code goes here

//         const data: type__indexer = job.data as type__indexer;

//         this.payload.logger.info('runner Indexer queue: ' + JSON.stringify(data));

//         const removed = await this.removeDigestos_uuid(data);
//         this.payload.logger.info('removed: ' + removed);
//         // TODO: remove old index
//         const r = await EmbeddingIndexInstance.save_collection_property_indexer(data);
//         return r;
//     };

//     public add = async (payload_document: type__indexer) => {
//         const coll = payload_document.target_collection;
//         const id = payload_document.document_id;
//         return this.superQueue.initJob(payload_document, `IndexerQueue:${coll}:${id}`);
//     }

// }

