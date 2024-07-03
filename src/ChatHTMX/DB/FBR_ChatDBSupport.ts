import type { FilterQuery, InferSchemaType, UpdateQuery } from 'mongoose';
import mongoose, { Types } from 'mongoose';
import { ZodType } from 'zod';
import { MaybePromise } from '../../types';

const fbrChatDBSupportCollSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assistantId: { type: String, required: true },
    manifestId: { type: String, required: true },
    title: { type: String, required: false },
    threadId: { type: String, required: false },
    created_at: { type: Date, required: false },
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


// this is an unique set of grouping for dbModel and string names,
// so we prevent this Cannot overwrite `dbmodel_modelname` model once compiled.
// OverwriteModelError: Cannot overwrite `oauth_users` model once compiled.
//     at Mongoose.model(D: \iiresodh\2version\SIAJ\node_modules\.pnpm\mongoose@8.2.3_socks@2.8.1\node_modules\mongoose\lib\mongoose.js: 565: 13)
//     at UserPassportDB.init(d: \iiresodh\2version\SIAJ\packages\fbr_function_tool_kit\src\ChatHTMX\DB\FBR_ChatDBSupport.ts: 51: 43)
//     at UserPassportDB.fetchById(d: \iiresodh\2version\SIAJ\packages\fbr_function_tool_kit\src\ChatHTMX\DB\FBR_ChatDBSupport.ts: 76: 9)
// at<anonymous>(d: \iiresodh\2version\SIAJ\packages\siaj\src\OAuth\ExpressOAuth.ts: 154: 30)
// So the following variable fix this.

const _map_of_db_models = new Map<string, mongoose.Model<any>>();


export class DatabaseSupport<T> {
    uri: string;
    dbModel!: mongoose.Model<T>;
    private has_init = false;

    validate_create_zod?: ZodType<any, any, any>;
    validate_edit_zod?: ZodType<any, any, any>;

    constructor(args: { uri?: string }) {
        if (!args.uri) {
            args.uri = process.env.MONGODB_URI || "";
        }
        this.uri = args.uri;
    }

    public async init() {
        if (!this.has_init) {
            await mongoose.connect(this.uri);
            const coll_name = (await this.get_collection_name());

            // here we prevent this Cannot overwrite `dbmodel_modelname` model once compiled.

            // this.dbModel = await mongoose.model<T>(coll_name, (await this.get_collection_schema()));
            if (!_map_of_db_models.has(coll_name)) {
                _map_of_db_models.set(coll_name, await mongoose.model<T>(coll_name, (await this.get_collection_schema())));
            }
            this.dbModel = _map_of_db_models.get(coll_name) as mongoose.Model<T>;

            this.has_init = true;
        }
        return this;
    }

    public async disconnect() {
        await mongoose.disconnect();
    }
    public get_collection_name(): MaybePromise<string> {
        throw new Error("Method not implemented.");
    }
    public get_collection_schema(): MaybePromise<mongoose.Schema<T>> {
        throw new Error("Method not implemented.");
    }

    /**
 * Fetches a document by its ID.
 * @param {string} id - The unique identifier of the document.
 * @returns {Promise<T>} - The document 
 */
    public async get_one(id: string): Promise<T & { id: string }> {
        return await this.fetchById(id);
    }
    public async fetchById(id: string): Promise<T & { id: string }> {
        await this.init();
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
        await this.init();
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


    public async create_one(data: T): Promise<T & { id: string }> {
        await this.init();
        const new_record = new this.dbModel<T>(data);
        await new_record.save();
        // TODO: change as any for proppr  types
        return { ...new_record.toObject(), id: (new_record._id as any).toString() };
    }

    async update_one(id: string, updateData: any) {
        return await this.update_partial(id, updateData);
    }

    async add_to_array(id: string, arrayName: string, data: any): Promise<T & { id: string }> {
        await this.init();
        const updatedDocument = await this.dbModel.findByIdAndUpdate(
            id,
            { $push: { [arrayName]: data } } as UpdateQuery<T>,
            { new: true, runValidators: true }
        ).exec();


        if (!updatedDocument) {
            throw new Error("Document not found or update failed");
        }

        return { ...updatedDocument.toObject(), id: (updatedDocument._id as any).toString() };
    }

    public async update_partial(id: string, updateData: Partial<T>): Promise<T & { id: string }> {
        await this.init();
        const updatedDocument = await this.dbModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedDocument) {
            throw new Error("Document not found or update failed");
        }

        return { ...updatedDocument.toObject(), id: (updatedDocument._id as any).toString() };
    }


    public async check_record_exist(query: FilterQuery<T>): Promise<boolean> {
        await this.init();
        const count = await this.dbModel.countDocuments(query);
        return count > 0;
    }


    // This func allows to get one record by a query
    public async get_one_by_query(query: FilterQuery<T>): Promise<T & { id: string } | null> {
        await this.init();
        const r = await this.dbModel.findOne(query).exec();
        if (!r) {
            return null;
        }
        return { ...r.toObject(), id: (r._id as any).toString() };

    }


    // This func allows to get one record by a query, ordered by created_at in descending order
    public async findMostRecentByQuery(query: FilterQuery<T>): Promise<T & { id: string } | null> {
        await this.init();
        const r = await this.dbModel.findOne(query).sort({ created_at: -1 }).exec();
        if (!r) {
            return null;
        }
        return { ...r.toObject(), id: (r._id as any).toString() };
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
        // Order by created_at so the newest sessions are returned first, so create a descending sort
        const orderedSessions = await this.dbModel.find({ userId }).sort({ created_at: -1 });
        // const sessions = await this.dbModel.find({ userId });
        return orderedSessions.map(session => ({ ...session.toObject(), id: session._id.toString() }));
    }

    public async create_user_session(data: FBR_ChatDBSupportCollData) {
        // at current time
        const created_at = new Date();
        data = { ...data, created_at };
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
