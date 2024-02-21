import _ from 'lodash';
import { MainUtils } from '../../../fbr_function_tool_kit/src/HostMachine/main_utils';
import { ComposedField } from "./types";
import { GetEditView, GetShowView } from './views/ViewsPath';


export type render_modeType = 'SHOW' | 'EDIT';


interface CollectionConfigBaseType<T> {
    title?: string,
    show_fields?: ComposedField<T>[],
    edit_fields?: ComposedField<T>[],
    render_mode: render_modeType
}
interface CollectionConfigEditType<T> extends CollectionConfigBaseType<T> {
    edit_fields: ComposedField<T>[],
    render_mode: 'EDIT'
}

interface CollectionConfigShowType<T> extends CollectionConfigBaseType<T> {
    show_fields: ComposedField<T>[],
    render_mode: 'SHOW'
}


type CollectionConfigType<T> = CollectionConfigEditType<T> | CollectionConfigShowType<T>;


export class CollectionConfig<T> {
    title?: string;
    fields: ComposedField<T>[];
    render_mode: render_modeType;

    constructor(args: CollectionConfigType<T>) {
        const { title, show_fields, edit_fields, render_mode } = args;
        this.title = title;
        this.render_mode = render_mode;
        if (render_mode === 'EDIT') {
            this.fields = edit_fields;
        } else {
            this.fields = show_fields;
        }
    }
    public GetView(str: string): string {
        if (this.render_mode === 'EDIT') {
            return GetEditView(str);
        }
        return GetShowView(str);
    }

    public async render(locals: any): Promise<string> {
        if (this.render_mode === 'EDIT') {
            return await this.render_edit(locals);
        } else {
            return await this.render_show(locals);
        }
    }

    public async render_edit(locals: any): Promise<string> {
        const template = await MainUtils.render_ejs_path_file(GetEditView('main'), {
            ...locals,
            htmx_configs: this,
            lodash: _
        });
        return template;
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
