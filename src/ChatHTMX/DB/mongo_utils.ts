import type { Document as MongoDBDocument } from "mongodb";
import { Collection, MongoClient } from "mongodb";

export function getMongoDbClientCollection(dbName: string, collectionName: string, uri?: string,): Collection<MongoDBDocument> {

    if (!uri) {
        uri = process.env.MONGODB_ATLAS_URI || ""
    }
    const client = new MongoClient(uri);

    const collection = client.db(dbName).collection(collectionName);

    return collection;
}