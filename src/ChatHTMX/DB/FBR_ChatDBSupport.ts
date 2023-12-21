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
interface FBR_ChatDBSupportColl extends MongoDBDocument {
    _id: ObjectId,
    id: string,
    userId: string,
    assistantId: string,
    manifestId: string,
    title: string,
}

export class FBR_ChatDBSupport {
    private chatSessionCollection: Collection<FBR_ChatDBSupportColl>;

    public constructor(dbName: string, collectionName = 'FBR_ChatSessionData') {
        this.chatSessionCollection = getMongoDbClientCollection(dbName, collectionName) as unknown as Collection<FBR_ChatDBSupportColl>;
    }
    private addStringId(document: MongoDBDocument): FBR_ChatDBSupportColl {
        return { ...document, id: document._id.toString() } as FBR_ChatDBSupportColl;
    }

    public async get_user_sessions(userId: string) {
        const sessions = await this.chatSessionCollection.find({ userId }).toArray();
        return sessions.map(this.addStringId);
    }

    public async get_session(sessionId: string): Promise<FBR_ChatDBSupportColl | undefined> {
        const session = await this.chatSessionCollection.findOne(this.get_id_pairs(sessionId)) as FBR_ChatDBSupportColl | undefined;
        return session ? this.addStringId(session) : undefined;
    }

    public async create_user_session(data: Omit<FBR_ChatDBSupportColl, "id" | "_id">) {
        const result = await this.chatSessionCollection.insertOne(data as FBR_ChatDBSupportColl);
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
