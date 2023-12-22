import type { InferSchemaType } from 'mongoose';
import mongoose from 'mongoose';

const coll_name = 'FBR_ChatSessionData';
const fbrChatDBSupportCollSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assistantId: { type: String, required: true },
    manifestId: { type: String, required: true },
    title: { type: String, required: false },
    threadId: { type: String, required: false },
    // other fields as necessary
});

type FBR_ChatDBSupportCollData = InferSchemaType<typeof fbrChatDBSupportCollSchema>;

export class FBR_ChatDBSupport2 {
    uri: string;
    FBR_ChatDBSupportColl!: mongoose.Model<FBR_ChatDBSupportCollData>;
    collectionName: string;

    constructor(args: { collectionName?: string, uri?: string }) {
        let { uri, collectionName } = args;

        if (!collectionName) {
            collectionName = 'FBR_ChatSessionData';
        }
        if (!uri) {
            uri = process.env.MONGODB_ATLAS_URI || "";
        }
        this.uri = uri;
        this.collectionName = collectionName;
    }
    public async init() {
        await mongoose.connect(this.uri);
        this.FBR_ChatDBSupportColl = await mongoose.model(coll_name, fbrChatDBSupportCollSchema);
    }
    public async disconnect() {
        await mongoose.disconnect();
    }
    public async get_user_sessions(userId: string) {
        const sessions = await this.FBR_ChatDBSupportColl.find({ userId });
        return sessions.map(session => ({ ...session.toObject(), id: session._id.toString() }));
    }

    public async create_user_session(data: FBR_ChatDBSupportCollData) {
        const newSession = new this.FBR_ChatDBSupportColl(data);
        await newSession.save();
        return { ...newSession.toObject(), id: newSession._id.toString() };
    }

    public async get_session(sessionId: string): Promise<FBR_ChatDBSupportCollData | null | undefined> {
        // Check if sessionId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return undefined;
        }

        const session = await this.FBR_ChatDBSupportColl.findById(sessionId);
        return session;
    }

    public async update_session_threadId(sessionId: string, threadId: string | null) {
        await this.FBR_ChatDBSupportColl.findByIdAndUpdate(sessionId, { threadId });
        return this.get_session(sessionId);
    }

    // Other methods as needed
}
