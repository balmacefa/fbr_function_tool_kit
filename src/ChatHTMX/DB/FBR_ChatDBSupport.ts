import type { InferSchemaType } from 'mongoose';
import mongoose, { Types } from 'mongoose';
import { MaybePromise } from '../../types';

const fbrChatDBSupportCollSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assistantId: { type: String, required: true },
    manifestId: { type: String, required: true },
    title: { type: String, required: false },
    threadId: { type: String, required: false },
    // other fields as necessary
});

type FBR_ChatDBSupportCollData = InferSchemaType<typeof fbrChatDBSupportCollSchema>;


export abstract class DatabaseSupport<T> {
    uri: string;
    dbModel!: mongoose.Model<T>;

    constructor(args: { uri?: string }) {
        if (!args.uri) {
            args.uri = process.env.MONGODB_URI || "";
        }
        this.uri = args.uri;
    }

    public async init() {
        await mongoose.connect(this.uri);
        const coll_name = (await this.get_collection_name());
        this.dbModel = await mongoose.model<T>(coll_name, (await this.get_collection_schema()));
        return this;
    }

    public async disconnect() {
        await mongoose.disconnect();
    }
    abstract get_collection_name(): MaybePromise<string>;
    abstract get_collection_schema(): MaybePromise<mongoose.Schema<T>>;

    /**
 * Fetches a document by its ID.
 * @param {string} id - The unique identifier of the document.
 * @returns {Promise<T>} - The document 
 */
    public async fetchById(id: string): Promise<T> {
        // Validate the ID format
        if (!Types.ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
        }

        const document = await this.dbModel.findById(id).exec();
        if (document) {
            return document;
        }
        throw new Error("ID not found Error");
    }
}


export class FBR_ChatDBSupport extends DatabaseSupport<FBR_ChatDBSupportCollData> {
    get_collection_name(): MaybePromise<string> {
        const coll_name = 'FBR_ChatSessionData';
        return coll_name;
    }
    get_collection_schema(): MaybePromise<mongoose.Schema<FBR_ChatDBSupportCollData>> {
        return fbrChatDBSupportCollSchema;
    }

    public async get_user_sessions(userId: string) {
        const sessions = await this.dbModel.find({ userId });
        return sessions.map(session => ({ ...session.toObject(), id: session._id.toString() }));
    }

    public async create_user_session(data: FBR_ChatDBSupportCollData) {
        const newSession = new this.dbModel(data);
        await newSession.save();
        return { ...newSession.toObject(), id: newSession._id.toString() };
    }

    public async get_session(sessionId: string): Promise<FBR_ChatDBSupportCollData | null | undefined> {
        // Check if sessionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return undefined;
        }

        const session = await this.dbModel.findById(sessionId);
        return session;
    }

    public async update_session_threadId(sessionId: string, threadId: string | null) {
        await this.dbModel.findByIdAndUpdate(sessionId, { threadId });
        return this.get_session(sessionId);
    }

}
