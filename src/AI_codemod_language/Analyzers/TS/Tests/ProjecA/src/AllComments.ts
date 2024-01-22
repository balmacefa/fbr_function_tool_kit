import { User } from "./User";

/** 
 * The default URL for the user avatar.
 * @const {string} defaultAvatarUrl
 */
const defaultAvatarUrl = "https://example.com/default-avatar.png";

/** 
 * A simple function returning the string 'bar'.
 * @function foo
 * @returns {string} The string 'bar'.
 */
const foo = () => { return 'bar' };

/** 
 * A function that returns the string 'bar'.
 * @function function_foo
 * @param {string} args - The arguments provided to the function.
 * @returns {string} The string 'bar'.
 */
function function_foo(args: string) {
    return 'bar';
}

/**
 * @class UserProfileManager
 * @description Manages user profiles, interfacing with the database to fetch and update user data.
 */
class UserProfileManager {
    /**
     * Database connection or instance used for user-related operations.
     * @private
     * @type {any}
     */
    private db: any;

    /**
     * Constructs a UserProfileManager instance with a database connection.
     * @constructor
     * @param {any} db - The database connection or instance.
     */
    constructor(db: any) {
        this.db = db;
    }

    /**
     * Retrieves a user's profile from the database.
     * @async
     * @public
     * @function getUserProfile
     * @param {number} userId - The ID of the user.
     * @returns {Promise<User>} A promise that resolves with the User object.
     * @throws Will throw an error if unable to fetch the user profile.
     */
    public async getUserProfile(userId: number): Promise<User> {
        try {
            const user: User = await this.db.getUserById(userId);
            return user;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }

    /**
     * Updates a user's avatar URL in the database.
     * @async
     * @public
     * @function updateUserAvatar
     * @param {number} userId - The ID of the user.
     * @param {string} [avatarUrl=defaultAvatarUrl] - The new URL of the user's avatar.
     * @returns {Promise<boolean>} A promise that resolves with true if the update was successful, false otherwise.
     * @throws Will throw an error if unable to update the user avatar.
     */
    public async updateUserAvatar(userId: number, avatarUrl: string = defaultAvatarUrl): Promise<boolean> {
        try {
            await this.db.updateUserAvatar(userId, avatarUrl);
            return true;
        } catch (error) {
            console.error("Error updating user avatar:", error);
            return false;
        }
    }
}

export { UserProfileManager };

