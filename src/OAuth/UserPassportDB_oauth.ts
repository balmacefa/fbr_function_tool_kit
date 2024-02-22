import argon2 from 'argon2';
import mongoose from 'mongoose';
import { DatabaseSupport } from '../ChatHTMX/DB/FBR_ChatDBSupport';
import { MaybePromise } from '../types';

// Assuming UserOAuthDB_Support is your generic type for database operations
export type UserOAuthDB_Support = {
    id?: string;
    // Define the structure here based on your user schema
    email: string;
    password?: string;
    googleId?: string;
    facebookId?: string;
    provider?: string;

    accessToken?: string;
    refreshToken?: string;
    profile_raw?: string;

    display_name?: string;
    family_name?: string;
    given_name?: string;
    locale?: string;
    picture?: string;
    roles?: string[];
};

export class UserPassportDB extends DatabaseSupport<UserOAuthDB_Support> {

    get_collection_name(): MaybePromise<string> {
        return 'oauth_users'; // Or your specific users collection name
    }

    get_collection_schema(): MaybePromise<mongoose.Schema<UserOAuthDB_Support>> {
        // Define and return the user schema
        const userSchema = new mongoose.Schema({


            email: { type: String, unique: true, required: true },
            password: String,
            googleId: String,
            facebookId: String,
            provider: String,
            accessToken: String,
            refreshToken: String,
            profile_raw: String,
            display_name: String,
            family_name: String,
            given_name: String,
            locale: String,
            picture: String,
            // Add any other fields you need for your user schema
            roles: { type: [String], default: ['default_role'] }, // Define roles como un arreglo de strings

        });

        return userSchema;
    }

    async createUser(userDetails: UserOAuthDB_Support): Promise<UserOAuthDB_Support> {
        await this.init();
        const user = new this.dbModel(userDetails);
        if (userDetails.password) {
            const hash = await argon2.hash(userDetails.password);
            user.password = hash;
        }
        await user.save();

        return { ...user.toObject(), id: (user._id as any).toString() };
    }

    async findUserByEmail(email: string): Promise<UserOAuthDB_Support | null> {
        await this.init();

        const document = await this.dbModel.findOne({ email }).exec();
        if (document) {
            return { ...document.toObject({ getters: true, virtuals: true }), id: (document._id as any).toString() };
        }
        return document;
    }

    async findUserByOAuthId(args: { googleId?: string, facebookId?: string }): Promise<mongoose.Document | null> {
        const { facebookId, googleId } = args;
        let query = {};
        if (googleId) query = { googleId };
        if (facebookId) query = { facebookId };

        return await this.dbModel.findOne(query);
    }

    async verify_password(user: UserOAuthDB_Support, password: string) {
        return (user.password && await argon2.verify(`${user.password}`, `${password}`));
    }

    // ... additional methods as needed
}

export default UserPassportDB;
