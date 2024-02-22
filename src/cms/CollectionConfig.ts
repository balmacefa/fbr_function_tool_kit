import _ from 'lodash';
import { MainUtils } from '../../../fbr_function_tool_kit/src/HostMachine/main_utils';
import { ComposedField, FlatPaths } from "./types";
import { GetShowView } from './views/ViewsPath';


interface CollectionConfigBaseType<T> {
    fields: ComposedField<FlatPaths<T>>[],
}


type CollectionConfigType<T> = CollectionConfigBaseType<T>;

export class CMSCollectionConfig<T> {
    fields: ComposedField<FlatPaths<T>>[];

    constructor(args: CollectionConfigType<T>) {
        const { fields } = args;
        this.fields = fields;
    }
    public GetView(str: string): string {
        return GetShowView(str);
    }

    public async render(locals: any): Promise<string> {
        return await this.render_show(locals);
    }

    public async render_show(locals: any): Promise<string> {
        const template = await MainUtils.render_ejs_path_file(GetShowView('main'), {
            ...locals,
            htmx_configs: this,
            lodash: _
        });
        return template;
    }

    // Additional methods can be added here
}
