import { User } from "./User";

const defaultAvatarUrl = "https://example.com/default-avatar.png";

const foo = () => { return 'bar' };

function function_foo(args: string) {
    return 'bar';
}

class UserProfileManager {
    private db: any;

    constructor(db: any) {
        this.db = db;
    }

    public async getUserProfile(userId: number): Promise<User> {
        try {
            const user: User = await this.db.getUserById(userId);
            return user;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }

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

