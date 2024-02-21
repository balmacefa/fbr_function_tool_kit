import { StrategyOptions as f_StrategyOptions } from "passport-facebook";
import { StrategyOptions as g_StrategyOptions } from "passport-google-oauth20";

// const host = process.env.HOST as string;
// if (!host) throw new Error("HOST env variable is required");
const g_clientID = process.env.GOOGLE_STRATEGY_CLIENTID as string;
if (!g_clientID) throw new Error("HOST env variable is required");


const g_clientSecret = process.env.GOOGLE_STRATEGY_CLIENTSECRET as string;
if (!g_clientSecret) throw new Error("HOST env variable is required");


const google_strategy: g_StrategyOptions = {
    clientID: g_clientID,
    clientSecret: g_clientSecret,
    callbackURL: "/auth/google/callback",
}

const facebook_strategy: f_StrategyOptions = {
    clientID: "",
    clientSecret: "",
    callbackURL: '/auth/facebook/callback'
}

const session_secret = process.env.SESSION_SECRET as string;
if (!session_secret) throw new Error("SESSION_SECRET env variable is required");


export const _ENV = {
    // host,
    google_strategy,
    facebook_strategy,
    session_secret
}