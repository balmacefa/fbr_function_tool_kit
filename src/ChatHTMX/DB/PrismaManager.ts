import type { Document as MongoDBDocument } from "mongodb";
import { Collection, MongoClient } from "mongodb";

export function getMongoDbClientCollection(dbName: string, collectionName: string, uri?: string): Collection<MongoDBDocument> {
    if (!uri) {
        uri = process.env.MONGODB_ATLAS_URI || "";
    }
    const client = new MongoClient(uri);
    const collection = client.db(dbName).collection(collectionName);
    return collection;
}

export class FBR_ChatDBSupport {
    private static instance?: FBR_ChatDBSupport;
    private chatSessionCollection: Collection<MongoDBDocument>;

    public constructor(dbName: string, collectionName = 'FBR_ChatSessionData') {
        this.chatSessionCollection = getMongoDbClientCollection(dbName, 'FBR_ChatSessionData');
    }

    public async get_user_sessions(userId: string) {
        return await this.chatSessionCollection.find({ userId }).toArray();
    }

    public async get_session(sessionId: string) {
        return await this.chatSessionCollection.findOne({ id: sessionId });
    }

    public async create_user_session(data: any) { // Define your data type
        return await this.chatSessionCollection.insertOne(data);
    }

    public async update_session_threadId(sessionId: any, threadId: string | null) { // Define sessionId type
        return await this.chatSessionCollection.updateOne(
            { id: sessionId },
            { $set: { threadId } }
        );
    }

    // Other methods as needed
}

// Additional code and comments...
