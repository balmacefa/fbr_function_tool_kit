// import { CreateAssistantOptions } from "../ChatHTMX";
import express, { Express } from 'express';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { MainUtils } from '../../HostMachine';
import { _ENV } from './Env_config';
import UserPassportDB from './UserPassportDB_oauth';

export const replaceColonParamsPattern = (baseStr: string, subs: string): string => {
    // This regular expression looks for a pattern starting with ':' followed by any characters
    // until it encounters a '/', or end of the string
    const pattern = /:([^/]+)/;
    // Replace the found pattern with the 'subs' string
    return baseStr.replace(pattern, subs);
}


export abstract class ExpressBaseExporter<Rr> {
    abstract common_data: any;
    abstract R: Rr;
    public app: Express;
    userPassportDB!: UserPassportDB;

    constructor(args: {
        app: Express,
    }) {
        this.app = args.app;
    }

    public extractFirstKeyValues(arr: Record<string, string>[]) {
        if (arr.length === 0) {
            return [];
        }

        const firstObject = arr[0];
        const firstKey = Object.keys(firstObject)[0];

        if (!firstKey) {
            return [];
        }

        return arr.map(item => item[firstKey]);
    }
    public get_ui_common_data() {
        // render_layout_path_top: this.render_layout_path_top,
        // render_layout_path_bottom: this.render_layout_path_bottom

        // const combinned_common_data = _.merge({
        //     render_layout_path_top: this.render_layout_path_top,
        //     render_layout_path_bottom: this.render_layout_path_bottom,
        // }, this.common_data);

        // console.log(this.common_data)
        return this.common_data;
    }

    public replacePattern(baseStr: string, subs: string): string {
        // This regular expression looks for a pattern starting with ':' followed by any characters
        // until it encounters a '/', or end of the string
        const pattern = /:([^/]+)/;
        // Replace the found pattern with the 'subs' string
        return baseStr.replace(pattern, subs);
    }

    public set_ejs_render_engine(base_path: string) {
        this.app.set("views", base_path);

        // Set the view engine to EJS
        this.app.set("view engine", "ejs");

        // Serve static files from the 'public' directory
        this.app.use(express.static(base_path + '/public'));
    }

    public cache_css() {
        const cacheDuration = 45 * 60 * 1000; // 45 minutes in milliseconds
        this.app.use((req, res, next) => {
            if (req.path.endsWith('.css')) {
                res.set('Cache-Control', `public, max-age=${cacheDuration / 1000}`);
            }
            next();
        });

    }

    // abstract __default_server(): void;
    abstract setupRoutes(): Promise<void>;
    abstract routes_definitions(): any;


    public usernameField = 'email';
    public passwordField = 'password'

    oauth_routes_paths(): {
        login: string;
        register: string;
    } {
        return {
            login: `login`,
            register: `register`
        }
    }

    setupPassport() {
        // Initialize Passport and restore authentication state, if any, from the session.
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        this.setupGoogleAuth();
        // this.setupFacebookAuth();
        this.setupLocalAuth();

        this.userPassportDB = new UserPassportDB({});
        this.setupAuthRoutes();
    }


    setupGoogleAuth(): void {
        passport.use(new GoogleStrategy(_ENV.google_strategy, async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
            // Google authentication logic
            try {
                const email = profile.emails?.[0].value; // Extract the primary email

                // Check if the user already exists in your database
                let user = await this.userPassportDB.findUserByEmail(email);

                if (!user) {
                    // If not, create a new user in your database
                    user = await this.userPassportDB.createUser({
                        profile,
                        googleId: profile.id,
                        email,
                        accessToken,
                        refreshToken,
                    });
                }

                return cb(null, user);
            } catch (error) {
                return cb(error, null);
            }

        }));
    }

    setupFacebookAuth(): void {
        passport.use(new FacebookStrategy(_ENV.facebook_strategy, async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
            // Facebook authentication logic

            try {
                const email = profile.emails?.[0].value; // Extract the primary email

                // Check if the user already exists in your database
                let user = await this.userPassportDB.findUserByEmail(email);

                if (!user) {
                    // If not, create a new user in your database
                    user = await this.userPassportDB.createUser({
                        profile,
                        facebookId: profile.id,
                        email,
                        accessToken,
                        refreshToken,
                    });
                }

                return cb(null, user);
            } catch (error) {
                return cb(error, null);
            }
        }));
    }

    setupLocalAuth(): void {
        passport.use(new LocalStrategy({
            usernameField: this.usernameField, // or 'username', depending on your form fields
            passwordField: this.passwordField
        }, async (email, password, done) => {
            // Local authentication logic

            try {
                // Find the user by email
                const user = await this.userPassportDB.findUserByEmail(email);
                if (!user) {
                    return done(null, false, { message: 'User not found.' });
                }

                // Verify the password
                if (await this.userPassportDB.verify_password(user, password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password.' });
                }
            } catch (error) {
                return done(error);
            }

        }));
    }

    setupAuthRoutes(): void {
        // Google Authentication Routes
        this.app.get('/auth/google',
            passport.authenticate('google', { scope: ['profile', 'email'] }));

        this.app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/login' }),
            (req, res) => {
                // Successful authentication, redirect home or to another page.
                res.redirect('/');
            });

        // Facebook Authentication Routes
        this.app.get('/auth/facebook',
            passport.authenticate('facebook'));

        this.app.get('/auth/facebook/callback',
            passport.authenticate('facebook', { failureRedirect: '/login' }),
            (req, res) => {
                // Successful authentication, redirect home or to another page.
                res.redirect('/');
            });

        // Local Authentication Routes
        // Login route
        this.app.post('/login',
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true // Enable flash messages for login errors
            }));

        // Registration route
        // Note: You'll need to implement the logic for registering a user
        this.app.post('/register', (req, res) => {
            // Registration logic here (e.g., hash password, save user to database)
        });

        const oauth_routes_paths = this.oauth_routes_paths();

        this.app.get('/login', async (req, res) => {

            const html = await MainUtils.render_ejs_path_file(oauth_routes_paths.login,
                {
                    ...this.get_ui_common_data(),
                });
            res.send(html);
        });

        this.app.get('/register', async (req, res) => {
            const html = await MainUtils.render_ejs_path_file(oauth_routes_paths.register,
                {
                    ...this.get_ui_common_data(),
                });
            res.send(html);
        });

        // Logout route
        this.app.get('/logout', (req, res) => {
            req.logout((err: any) => {
                return;
            });
            res.redirect('/login');
        });
    }

}