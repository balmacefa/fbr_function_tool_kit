import type { Document as MongoDBDocument } from "mongodb";
import { Collection, MongoClient, ObjectId } from "mongodb";

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
    private addStringId(document: MongoDBDocument): MongoDBDocument {
        return { ...document, id: document._id.toString() };
    }

    public async get_user_sessions(userId: string) {
        const sessions = await this.chatSessionCollection.find({ userId }).toArray();
        return sessions.map(this.addStringId);
    }

    public async get_session(sessionId: string) {
        const session = await this.chatSessionCollection.findOne(this.get_id_pairs(sessionId),);
        return session ? this.addStringId(session) : null;
    }

    public async create_user_session(data: any) {
        const result = await this.chatSessionCollection.insertOne(data);
        return this.addStringId({ ...data, _id: result.insertedId });
    }

    public get_id_pairs(sessionId: string) { return { _id: new ObjectId(sessionId) } }

    public async update_session_threadId(sessionId: any, threadId: string | null) {
        const result = await this.chatSessionCollection.updateOne(
            this.get_id_pairs(sessionId),
            { $set: { threadId } }
        );
        return await this.get_session(sessionId);
    }

    // Other methods as needed
}

// Additional code and comments...
