// import { CreateAssistantOptions } from "../ChatHTMX";
import { Express, NextFunction, Request, Response } from 'express';
import session from 'express-session';
import _ from 'lodash';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { _ENV } from '../ChatHTMX/Sever/Env_config';
import { login_register_template } from '../ChatHTMX/Sever/OAuthTemplate';
import { EJS_Page } from '../EjsUtils/page';
import UserPassportDB from './UserPassportDB_oauth';

const default_ExpressOAuthProps = {
    usernameField: 'email',
    passwordField: 'password',
    auth_google: '/auth/google',
    auth_google_callback: '/auth/google/callback',
    auth_facebook: '/auth/facebook',
    auth_facebook_callback: '/auth/facebook/callback',

    redirect_success: '/',
    redirect_failure: '/login',
    login: '/login',
    register: '/register',
    logout: '/logout'
}



type ExpressOAuthProps = typeof default_ExpressOAuthProps;
type no_args_func = () => any;
export class ExpressOAuth {

    public app: Express;
    public props: ExpressOAuthProps;
    userPassportDB!: UserPassportDB;

    // REQUIRED
    constructor(args: {
        app: Express,
        props: Partial<ExpressOAuthProps>
    }) {

        this.props = {
            ...default_ExpressOAuthProps,
            ...args.props
        };


        this.app = args.app;
    }





    //  this.app.get('/dev/admin', [ExpressOAuth.EnsureAuthenticated({}), ExpressOAuth.CheckRole({ roles: ['admin'] })], (req: any, res: any) => {
    //      res.send('Panel de Administrador');
    //  });
    // this.app.get('/dev/default_role', [ExpressOAuth.CheckRole({ roles: ['default_role'] })], (req: any, res: any) => {
    //     res.send('Panel de default_role USER');
    // });



    static CheckRole(args: { roles: string[], html_403?: string, req_property?: string }) {
        let { req_property, html_403 } = args;
        req_property = req_property ? req_property : 'user.roles';
        html_403 = html_403 ? html_403 : 'Role No autorizado'; // TODO change html string

        return function (req: Request, res: Response, next: NextFunction) {
            const userRoles: string[] = _.get(req, req_property, []);
            const hasRequiredRole = args.roles.some(role => userRoles.includes(role));
            if (hasRequiredRole) {
                return next();
            }
            // Si el usuario no tiene el rol necesario, manejar según corresponda (error, redirección, etc.)
            res.status(403).send(html_403);
        }
    }
    static EnsureAuthenticated(args: { redirect?: string }) {
        let { redirect } = args;
        redirect = redirect ? redirect : '/login';

        return function (req: Request, res: Response, next: NextFunction) {
            if (req.isAuthenticated()) {
                return next();
            }
            // Si no está autenticado, redirigir al login
            res.redirect(redirect);

        }
    }



    // ENTRY POINT FUNC CLASS
    setupPassport(get_ui_common_data: no_args_func) {
        // Initialize Passport and restore authentication state, if any, from the session.



        // Session configuration
        this.app.use(session({
            secret: _ENV.session_secret, // This secret will be used to sign the session ID cookie. Use a real, secure string in production.
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
        this.setupDevRoutes();
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
            usernameField: this.props.usernameField, // or 'username', depending on your form fields
            passwordField: this.props.passwordField
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
        this.app.get(this.props.auth_google,
            passport.authenticate('google', { scope: ['profile', 'email'] }));

        this.app.get(this.props.auth_google_callback,
            passport.authenticate('google', { failureRedirect: '/login' }),
            (req, res) => {
                // Successful authentication, redirect home or to another page.
                res.redirect('/');
            });

        // Facebook Authentication Routes
        this.app.get(this.props.auth_facebook,
            passport.authenticate('facebook'));

        this.app.get(this.props.auth_facebook_callback,
            passport.authenticate('facebook', { failureRedirect: this.props.redirect_failure }),
            (req, res) => {
                // Successful authentication, redirect home or to another page.
                res.redirect(this.props.redirect_success);
            });

        // Local Authentication Routes
        // Login route
        this.app.post(this.props.login,
            passport.authenticate('local', {
                successRedirect: this.props.redirect_success,
                failureRedirect: this.props.redirect_failure,
                failureFlash: true // Enable flash messages for login errors
                // TODO review flash messsage with ejs
            }));

        // Registration route
        // Note: You'll need to implement the logic for registering a user
        this.app.post(this.props.register, (req, res) => {
            // Registration logic here (e.g., hash password, save user to database)
        });

        const EJS_Page_Parser = new EJS_Page();

        this.app.get(this.props.login, (req, res) => {


            const html = EJS_Page_Parser.to_ejs(login_register_template);
            res.send(html);

        });


        // // TODO??
        // this.app.get(this.props.register, async (req, res) => {
        //     const html = await MainUtils.render_ejs_path_file(oauth_routes_paths.register,
        //         {
        //             ...get_ui_common_data(),
        //         });
        //     res.send(html);
        // });

        // Logout route
        this.app.get(this.props.logout, (req, res) => {
            req.logout((err: any) => {
                return;
            });
            res.redirect(this.props.login);
        });

    }
    setupDevRoutes(): void {
        // Google Authentication Routes
        const EJS_Page_Parser = new EJS_Page();

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

            this.app.get('/dev/admin', [ExpressOAuth.EnsureAuthenticated({}), ExpressOAuth.CheckRole({ roles: ['admin'] })], (req: any, res: any) => {
                res.send('Panel de Administrador');
            });
            this.app.get('/dev/default_role', [ExpressOAuth.CheckRole({ roles: ['default_role'] })], (req: any, res: any) => {
                res.send('Panel de default_role USER');
            });
            // EnsureAuthenticated

        }


    }




}