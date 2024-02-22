import _ from 'lodash';
import { MainUtils } from '../../../fbr_function_tool_kit/src/HostMachine/main_utils';
import { ComposedField } from "./types";
import { GetShowView } from './views/ViewsPath';


interface CollectionConfigBaseType {
    fields: ComposedField<unknown>[],
}


type CollectionConfigType = CollectionConfigBaseType;

export class CMSCollectionConfig {
    fields: ComposedField<unknown>[];

    constructor(args: CollectionConfigType) {
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
