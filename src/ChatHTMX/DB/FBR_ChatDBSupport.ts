import type { FilterQuery, InferSchemaType } from 'mongoose';
import mongoose, { Types } from 'mongoose';
import { PaginationData } from '../../../../../../../ios_cms_iiresodh/node_payload_app/src/components/shared_types';
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

export interface PaginationQuery<T> {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: null | number;
    nextPage: null | number;
    docs: T[]; // The array of documents of type T
}


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
            return { ...document.toObject(), id: (document._id as any).toString() };
        }
        throw new Error("ID not found Error");
    }


    /**
     * Gets paginated documents from the database.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @param {Object} query - Optional query object to filter results.
     * @returns {Promise<PaginationData & { docs: T[] }>} - The paginated documents.
     */
    public async getPaginated(page: number, limit: number, query: FilterQuery<T> = {}): Promise<PaginationQuery<T>> {
        const totalDocs = await this.dbModel.countDocuments(query);
        const totalPages = Math.ceil(totalDocs / limit);
        const offset = (page - 1) * limit;

        const documents = await this.dbModel.find(query)
            .skip(offset)
            .limit(limit)
            .exec();

        const docs = documents.map((doc) => {
            return { ...doc.toObject({ getters: true, virtuals: true }), id: (doc._id as any).toString() }
        }) as T[];

        // const docs = documents.map((doc: Document) => doc.toObject()) as T[];

        return {
            totalDocs,
            limit,
            totalPages,
            page,
            pagingCounter: offset + 1,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            docs
        };
    }


    public async create_one(data: T) {
        const new_record = new this.dbModel(data);
        await new_record.save();
        // TODO: change as any for proppr  types
        return { ...new_record.toObject(), id: (new_record._id as any).toString() };
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
        return await this.create_one(data);
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
