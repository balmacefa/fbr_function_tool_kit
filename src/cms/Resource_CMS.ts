import { FilterQuery } from "mongoose";
import { ZodType } from "zod";
import { DatabaseSupport } from "../ChatHTMX/DB/FBR_ChatDBSupport";
import { HTML_OR_ERROR, MaybePromise } from '../types';
import { CMSCollectionConfig } from "./CollectionConfig";
import { WrappedWithPaginationAndList } from "./render_utils";
import { set_resource_urls } from "./url_string_generator";
export interface IBaseCMSResource {
    // Método para retornar el HTML del menú lateral
    getSidebarHtml(): MaybePromise<string>;

    // Método para retornar el HTML del botón de landing
    getLandingButtonHtml(): MaybePromise<string>;

    // Método para retornar el contenido del index de landing
    // Podría retornar un objeto con título, descripción y la tabla de recursos
    getLandingHtml(): MaybePromise<string>;

    // Método para mostrar el formulario de creación de un nuevo recurso
    // Se separan los métodos para GET y POST
    getNewResourceFormHtml(): MaybePromise<string>;

    // Método para mostrar y procesar el formulario de edición de un recurso
    // Se separan los métodos para GET y POST
    get_EditResourceFormHTML(id_param: string): MaybePromise<string>;

    // Métodos para mostrar un recurso en HTML y JSON
    getShowResourceHTML(hit: any): void;


    cms_ops_createResource<T = any>(data: T, return_type: 'id' | 'content'): MaybePromise<HTML_OR_ERROR>;
    cms_ops_updateResource<T = any>(id: string, upsert_data: T): MaybePromise<HTML_OR_ERROR>;

    on_operation_error(ops: string, content: string): string;
}



type t_get_url_paths = {
    index: string,
    show: string,
    edit: string,
    create: string,
};

type t_post_url_paths = {
    edit: string,
    create: string,
    paginate: string,
};

export class Resource_CMS implements IBaseCMSResource {

    DBSupport: DatabaseSupport<any>;
    validate_create_zod?: ZodType<any, any, any>;
    validate_edit_zod?: ZodType<any, any, any>;

    slug: string;

    create_form_CMSCollectionConfig?: CMSCollectionConfig;
    edit_form_CMSCollectionConfig?: CMSCollectionConfig;
    show_item_CMSCollectionConfig?: CMSCollectionConfig;
    list_item_CMSCollectionConfig?: CMSCollectionConfig;
    get_url_paths!: t_get_url_paths;
    post_url_paths!: t_post_url_paths;

    constructor(args: {
        DBSupport: DatabaseSupport<any>,
        create_form_CMSCollectionConfig?: CMSCollectionConfig,
        edit_form_CMSCollectionConfig?: CMSCollectionConfig,
        list_item_CMSCollectionConfig?: CMSCollectionConfig,
        show_item_CMSCollectionConfig?: CMSCollectionConfig,
        slug: string,
    }) {
        this.DBSupport = args.DBSupport;
        this.validate_create_zod = args.DBSupport.validate_create_zod;
        this.validate_edit_zod = args.DBSupport.validate_edit_zod;
        this.create_form_CMSCollectionConfig = args.create_form_CMSCollectionConfig;
        this.edit_form_CMSCollectionConfig = args.edit_form_CMSCollectionConfig;
        this.list_item_CMSCollectionConfig = args.list_item_CMSCollectionConfig;
        this.show_item_CMSCollectionConfig = args.show_item_CMSCollectionConfig;
        this.slug = args.slug;
    }


    init_set_resource_urls(url_prefix = '') {
        const router = set_resource_urls(this.slug, url_prefix);
        this.get_url_paths = router.get_url_paths;
        this.post_url_paths = router.post_url_paths;
    }


    on_operation_error(ops: string, content: string): string {
        return /*template*/`
<div class="max-w-lg mx-auto mt-10 p-6 bg-red-100 border-l-4 border-red-500 text-red-700">
    <h2 class="text-lg font-semibold">Error in ${ops}</h2>
    <p class="mt-2">${content}</p>
</div>
    `;
    }
    async cms_ops_createResource<T = any>(data: T): Promise<HTML_OR_ERROR> {
        try {
            // Si validate_create_zod está definido, valida los datos primero
            let validatedData = data;
            if (this.validate_create_zod) {
                const result = this.validate_create_zod.safeParse(data);
                if (!result.success) {
                    // Si la validación falla, retorna el error de validación
                    const htmlError = this.on_operation_error("cms_ops_createResource", "Validation failed");
                    return { error: htmlError };
                }
                validatedData = result.data;
            }

            // Intenta crear el recurso con los datos validados o originales
            const new_data = await this.DBSupport.create_one(validatedData);
            return { success: new_data.id };
        } catch (error) {
            console.error(error);
            const htmlError = this.on_operation_error("cms_ops_createResource", JSON.stringify(error));
            return { error: htmlError };
        }
    }


    async cms_ops_updateResource<T = any>(id: string, upsert_data: T): Promise<HTML_OR_ERROR> {
        try {
            // Si validate_edit_zod está definido, valida los datos primero
            let validatedData = upsert_data;
            if (this.validate_edit_zod) {
                const result = this.validate_edit_zod.safeParse(upsert_data);
                if (!result.success) {
                    // Si la validación falla, retorna el error de validación
                    const htmlError = this.on_operation_error("cms_ops_updateResource", "Validation failed");
                    return { error: htmlError };
                }
                validatedData = result.data;
            }

            // Intenta actualizar el recurso con los datos validados o originales
            const updated_data = await this.DBSupport.update_one(id, validatedData);
            return { success: updated_data.id };
        } catch (error) {
            console.error(error);
            const htmlError = this.on_operation_error("cms_ops_updateResource", JSON.stringify(error));
            return { error: htmlError };
        }
    }


    getSidebarHtml(): string {

        const url_path = this.get_url_paths.index;
        const title = this.slug;
        const icon = "fas fa-search fa-2x text-gray-500"

        const t = /*template*/`

<!-- Nav Icon with no background color and a bottom border for non-active items -->
<a href="${url_path}">
  <div id="path_url_${url_path}" class="hover:bg-slate-200 hover:shadow-lg shadow-sm border-b-2 border-slate-600' nav-icon w-24 h-24 p-8 flex-col justify-center items-center gap-2 flex transition-all duration-300">
    <!-- Replace 'fa-icon' with your icon -->
    <i class="${icon}" fill="currentColor"></i>
    <div class="text-center text-xs font-bold h-48">${title}</div>
  </div>
</a>

        `;
        return t;
    }

    getLandingButtonHtml(): string {
        // Define the URL to which the button will redirect
        const url_path = this.get_url_paths.index;
        // Button text can be the name of the resource or any other relevant text
        const title = this.slug;
        // Icon class from FontAwesome or any other icon library you're using
        const buttonIcon = "fas fa-tools"; // Example FontAwesome icon for admin tools

        // Constructing the button HTML using a template literal
        const buttonHtml = /*template*/`
<!-- Square button with hover effect, using inline styles for the square aspect -->
<a href="${url_path}" style="width: 100px; height: 100px; display: flex; justify-content: center; align-items: center;" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    <!-- Icon, visually centered -->
    <i class="${buttonIcon} fa-lg"></i>
    <!-- Text, might be omitted or styled differently if the button should be icon-only -->
    <span class="sr-only">${title}</span> <!-- sr-only class hides text visually but keeps it accessible to screen readers -->
</a>
    `;

        return buttonHtml;
    }

    getNewResourceButtonHtml(): string {
        // Define the URL to which the button will redirect for creating a new resource
        const url_path = this.post_url_paths.create; // Assuming there's a 'create' path for new resources
        // Button text for the "New Resource" button
        const title = "New Resource"; // Specific text for the new resource button
        // Icon class for the button, assuming 'fas fa-plus' for adding a new resource
        const buttonIcon = "fas fa-plus"; // FontAwesome icon for adding new items

        // Constructing the button HTML using a template literal
        const buttonHtml = /*template*/`
<!-- Square button with hover effect for creating a new resource -->
<a href="${url_path}" style="width: 100px; height: 100px; display: flex; justify-content: center; align-items: center;" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
    <!-- Icon, visually centered -->
    <i class="${buttonIcon} fa-lg"></i>
    <!-- Text for screen readers -->
    <span class="sr-only">${title}</span> <!-- Ensures the button remains accessible -->
</a>
    `;

        return buttonHtml;
    }



    async getLandingHtml(): Promise<string> {

        const paginatedResource = await this.paginatedResource(1, 3);

        const title = this.slug;

        const template = /*template*/ `
<article class="bg-gray-100 p-8">
  <div class="flex justify-between items-center mb-4">
    <h1 class="" >${title}</h1>

    ${this.getNewResourceButtonHtml()}
  </div>

  <main>
      ${paginatedResource}
  </main>

</article>
    `;
        return template;
    }


    public async paginatedResource(page: number, limit: number, query: FilterQuery<any> = {}) {


        const paginated_data = await this.DBSupport.getPaginated(page, limit, query);

        // Use Promise.all to wait for all promises to resolve
        const combinedHtml: string = (await Promise.all(paginated_data.docs.map((doc) => {
            return this.list_item_CMSCollectionConfig?.render({ hit: doc }) || '';
        }))).join('\n');


        // them create a a 
        const post_url = this.post_url_paths.paginate; // Assuming there's a 'create' path for new resources

        const template = WrappedWithPaginationAndList(paginated_data,
      /*template*/ `
      
      <div id="table_array_container" class="flex flex-col divide-y divide-gray-200 ">
    <!-- The template for the array items will be inserted here -->
          ${combinedHtml}
    </div>

    `,
            post_url,
            limit
        );

        return template;
    }


    async getNewResourceFormHtml(): Promise<string> {

        const html = await this.create_form_CMSCollectionConfig?.render({ hit: {} });

        return html || '';
    }
    async get_EditResourceFormHTML(id_param: string): Promise<string> {
        try {
            const hit = await this.DBSupport.fetchById(id_param);
            const html = await this.edit_form_CMSCollectionConfig?.render({ hit });
            return html || '';
        } catch (error) {
            console.error(error);
            // Genera y retorna el HTML de error
            return this.on_operation_error("get_EditResourceFormHTML", JSON.stringify(error));
        }
    }

    async getShowResourceHTML(id_param: string): Promise<string> {
        try {
            const hit = await this.DBSupport.fetchById(id_param);
            const html = await this.show_item_CMSCollectionConfig?.render({ hit });
            return html || '';
        } catch (error) {
            console.error(error);
            // Genera y retorna el HTML de error
            return this.on_operation_error("getShowResourceHTML", JSON.stringify(error));
        }
    }

    base_path(str: string): string {
        return `/admin/Resource_CMS/${str}`;
    }

    fragment_path(str: string) {
        return `${this.base_path(str)}/fragment`;
    }

}


