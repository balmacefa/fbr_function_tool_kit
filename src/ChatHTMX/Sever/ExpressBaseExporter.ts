// import { CreateAssistantOptions } from "../ChatHTMX";
import express, { Express } from 'express';
import { ExpressOAuth } from '../../OAuth/ExpressOAuth';
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


    setupOAuth() {

        const express_oauth = new ExpressOAuth({ app: this.app });
        express_oauth.setupPassport(this.get_ui_common_data)
    }


}