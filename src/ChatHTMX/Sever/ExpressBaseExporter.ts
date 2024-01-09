// import { CreateAssistantOptions } from "../ChatHTMX";

import _ from "lodash";



export const replaceColonParamsPattern = (baseStr: string, subs: string): string => {
    // This regular expression looks for a pattern starting with ':' followed by any characters
    // until it encounters a '/', or end of the string
    const pattern = /:([^/]+)/;
    // Replace the found pattern with the 'subs' string
    return baseStr.replace(pattern, subs);
}


export abstract class ExpressBaseExporter<T> {
    abstract common_data: any;
    abstract R: T;
    abstract render_layout_path_top: string;
    abstract render_layout_path_bottom: string;

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

        const combinned_common_data = _.merge({
            render_layout_path_top: this.render_layout_path_top,
            render_layout_path_bottom: this.render_layout_path_bottom,
        }, this.common_data);

        // console.log(this.common_data)
        return combinned_common_data
    }

    public replacePattern(baseStr: string, subs: string): string {
        // This regular expression looks for a pattern starting with ':' followed by any characters
        // until it encounters a '/', or end of the string
        const pattern = /:([^/]+)/;
        // Replace the found pattern with the 'subs' string
        return baseStr.replace(pattern, subs);
    }

    // abstract __default_server(): void;
    abstract setupRoutes(): Promise<void>;
    abstract routes_definitions(): any;
}