import * as ejs from 'ejs';
import { reactViews } from "express-tsx-views";
import { MainUtils } from './main_utils';

import { setupReactViews } from "express-tsx-views";

const options = {
    viewsDirectory: path.resolve(__dirname, "../views"),
};

setupReactViews(app, options);


export class RenderUtils {

    static async render_ejs_string(ejs_string: string, data: any): Promise<string> {
        const html = await ejs.render(ejs_string, { ...data }, { async: true });
        return html;
    }
    static async render_ejs_path_file(ejs_absolute_path_file: string, data: any): Promise<string> {
        const template = MainUtils.read_file_from_path(ejs_absolute_path_file);
        return await MainUtils.render_ejs_string(template, { ...data });
    }

    static async render_tsx_file(ts_absolute_path_file: string, ts_views_base_directory: string): Promise<string> {
        const renderFile = reactViews({ viewsDirectory: __dirname })

        const callback = jest.fn()

        const html = await renderFile(
            resolve(__dirname, '../example/views/my-component'),
            {},
            callback,
        );

        return html;

    }

}