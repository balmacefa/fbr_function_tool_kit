// import { CreateAssistantOptions } from "../ChatHTMX";
import { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { EJS_Page } from '../../EjsUtils/page';
import { MainUtils } from '../../HostMachine';
import { _ENV } from './Env_config';
import { login_register_template } from './OAuthTemplate';
import UserPassportDB from './UserPassportDB_oauth';


type no_args_func = () => any;
export class ExpressOAuth {

    public app: Express;
    userPassportDB!: UserPassportDB;

    constructor(args: {
        app: Express,
    }) {
        this.app = args.app;
    }


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

    setupPassport(get_ui_common_data: no_args_func) {
        // Initialize Passport and restore authentication state, if any, from the session.



        // Session configuration
        this.app.use(session({
            secret: 'your secret key', // This secret will be used to sign the session ID cookie. Use a real, secure string in production.
            resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
            saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
            // You can add more options here, like cookie settings and store settings.
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // Passport serialization
        passport.serializeUser((user: any, done) => {
            done(null, user.id); // Serialize user ID into the session
        });

        // Passport deserialization
        passport.deserializeUser(async (id: string, done) => {
            try {
                const user = await this.userPassportDB.fetchById(id);
                done(null, user); // User object attached to req.user
            } catch (error) {
                done(error, null);
            }
        });

        this.setupGoogleAuth();
        // this.setupFacebookAuth();
        this.setupLocalAuth();

        this.userPassportDB = new UserPassportDB({});
        this.setupAuthRoutes(get_ui_common_data);
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
                    const profile_raw = JSON.stringify(profile._json);

                    user = await this.userPassportDB.createUser({
                        profile_raw,
                        email,
                        accessToken,
                        refreshToken,
                        googleId: profile.id,

                        display_name: profile.displayName,
                        family_name: profile.name.familyName,
                        given_name: profile.name.givenName,
                        provider: profile.provider,
                        locale: profile._json.locale,
                        picture: profile._json.picture,
                    });
                }

                return cb(null, user);
            } catch (error) {
                return cb(error, null);
            }

        }));
    }

    // setupFacebookAuth(): void {
    //     passport.use(new FacebookStrategy(_ENV.facebook_strategy, async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    //         // Facebook authentication logic

    //         try {
    //             const email = profile.emails?.[0].value; // Extract the primary email

    //             // Check if the user already exists in your database
    //             let user = await this.userPassportDB.findUserByEmail(email);

    //             if (!user) {
    //                 // If not, create a new user in your database
    //                 user = await this.userPassportDB.createUser({
    //                     profile,
    //                     facebookId: profile.id,
    //                     email,
    //                     accessToken,
    //                     refreshToken,
    //                 });
    //             }

    //             return cb(null, user);
    //         } catch (error) {
    //             return cb(error, null);
    //         }
    //     }));
    // }

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

    setupAuthRoutes(get_ui_common_data: no_args_func): void {
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
        const EJS_Page_Parser = new EJS_Page();

        this.app.get('/login', (req, res) => {


            const html = EJS_Page_Parser.to_ejs(login_register_template);
            res.send(html);

        });

        this.app.get('/register', async (req, res) => {
            const html = await MainUtils.render_ejs_path_file(oauth_routes_paths.register,
                {
                    ...get_ui_common_data(),
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


        // Dentro de tu configuración de Express, después de haber configurado Passport y tus rutas:

        if (process.env.NODE_ENV === 'development') {
            this.app.get('/dev/user', (req, res) => {
                if (req.isAuthenticated()) {

                    const userJsonPretty = JSON.stringify(req.user, null, 4); // Convierte el objeto del usuario a JSON con indentación

                    const html = EJS_Page_Parser.to_ejs(`<pre>${userJsonPretty}</pre>`);
                    res.send(html);
                } else {
                    res.status(401).send('Usuario no autenticado');
                }
            });
        }


    }

}