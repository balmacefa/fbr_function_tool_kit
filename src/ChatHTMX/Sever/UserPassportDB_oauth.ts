import argon2 from 'argon2';
import mongoose from 'mongoose';
import { MaybePromise } from '../../types';
import { DatabaseSupport } from '../DB/FBR_ChatDBSupport';

// Assuming DB_Support is your generic type for database operations
type DB_Support = {
    // Define the structure here based on your user schema
    email: string;
    password?: string;
    googleId?: string;
    facebookId?: string;

    accessToken?: string;
    refreshToken?: string;
    profile?: string;
    // ... other relevant user fields


};

class UserPassportDB extends DatabaseSupport<DB_Support> {

    get_collection_name(): MaybePromise<string> {
        return 'users'; // Or your specific users collection name
    }

    get_collection_schema(): MaybePromise<mongoose.Schema<DB_Support>> {
        // Define and return the user schema
        const userSchema = new mongoose.Schema({
            email: { type: String, unique: true, required: true },
            password: String,
            googleId: String,
            facebookId: String,
            // ... other fields
        });

        return userSchema;
    }

    async createUser(userDetails: DB_Support): Promise<DB_Support> {
        const user = new this.dbModel(userDetails);
        if (userDetails.password) {
            const hash = await argon2.hash(userDetails.password);
            user.password = hash;
        }
        await user.save();
        return user;
    }

    async findUserByEmail(email: string): Promise<DB_Support | null> {
        return await this.dbModel.findOne({ email });
    }

    async findUserByOAuthId(args: { googleId?: string, facebookId?: string }): Promise<mongoose.Document | null> {
        const { facebookId, googleId } = args;
        let query = {};
        if (googleId) query = { googleId };
        if (facebookId) query = { facebookId };

        return await this.dbModel.findOne(query);
    }

    async verify_password(user: DB_Support, password: string) {
        return (user.password && await argon2.verify(`${user.password}`, `${password}`));
    }

    // ... additional methods as needed
}

export default UserPassportDB;
