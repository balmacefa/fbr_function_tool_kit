import { MainUtils } from "../../HostMachine";
import { Here_add } from "./HerePath";
type Locals = Record<string, any>;

export class RenderEngine_ejs {
    locals_name = 'utils';
    header = '';
    footer = '';

    title = 'WebSite Title';

    html_content = '';

    add_extra_header_content(lines: string) {
        this.header += "\n" + lines + "\n";
    }

    add_extra_footer_content(lines: string) {
        this.footer += "\n" + lines + "\n";
    }
    extra_footer_content() {
        return this.footer;
    }
    // 
    extra_header_content() {
        return this.header;
    }
    website_title() {
        return this.title;
    }
    _get_html_content() {
        return this.html_content;
    }

    async render_entry_file(adsolute_pathfile: string) {
        const locals: Locals = {};
        locals[this.locals_name] = this;

        // this can potencilly call the add add_content_to_header
        this.html_content = await MainUtils.render_ejs_path_file(adsolute_pathfile, locals);

        // so we need to render in 2 steps
        const base_htmlTemplate = Here_add('/HTMX/HtmlBase.ejs');
        const html = await MainUtils.render_ejs_path_file(base_htmlTemplate, locals);
        return html;
    }


}


