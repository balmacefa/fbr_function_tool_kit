import { Express } from "express";
import { replaceColonParamsPattern } from "../ChatHTMX";
import { EJS_Page } from "../EjsUtils/page";
import { EJS_PageWithBreadcrumb, breadcrumb_type } from "./Page/PageBuilder";
import { Resource_CMS } from "./Resource_CMS"; // Assuming Resource_CMS is in the same directory
import { set_cms_control_plane_urls, set_resource_urls } from "./url_string_generator";

export class CMSControlPlane {
    public resources: Resource_CMS[] = [];
    public app: Express;

    public logo_html: string;

    public url_prefix = `admin`;
    title: string;

    private controlPlaneUrls: ReturnType<typeof set_cms_control_plane_urls>;


    constructor(args: {
        app: Express,
        logo_html: string,
        url_prefix?: string
        title: string;
    }) {
        this.controlPlaneUrls = set_cms_control_plane_urls(this.url_prefix);
        this.title = args.title;
        this.url_prefix = args.url_prefix || `admin`;
        this.app = args.app;
        this.logo_html = args.logo_html;

        this.init_setupRoutesForCMS();

        console.log(this.controlPlaneUrls);
    }



    /**
     * Adds a new CMS resource and sets up its routes.
     * @param slug A unique slug for the resource's routes.
     * @param resource An instance of Resource_CMS representing the new resource.
     */
    public addResourceAndSetupRoutes(resource: Resource_CMS) {
        // Add the resource to the resources array
        this.resources.push(resource);

        resource.init_set_resource_urls(this.url_prefix);

        // Setup routes for the new resource
        this.setupRoutesForResource(resource);
    }

    /**
     * Dynamically sets up Express routes for a given CMS resource.
     * @param identifier A unique identifier for the resource.
     * @param resource The Resource_CMS instance.
     */
    public setupRoutesForResource(resource: Resource_CMS) {

        const router = set_resource_urls(resource.slug, this.url_prefix);
        const pageBuilder = new EJS_PageWithBreadcrumb();

        const Breadcrumb: breadcrumb_type[] = [
            {
                label: 'Dashboard',
                value: this.controlPlaneUrls.dashboard
            }
        ];

        // Example: Setup a route for the resource's landing page
        this.app.get(router.get_url_paths.index, async (req, res) => {
            try {
                const resourcelandingHtml = await resource.getLandingHtml();

                const Breadcrumb_page_collection: breadcrumb_type[] = [...Breadcrumb, {
                    label: resource.slug,
                    value: router.get_url_paths.index,
                }]
                const html = pageBuilder.to_ejs(resourcelandingHtml, this.createSidebarMenu(), Breadcrumb_page_collection);
                res.send(html);

            } catch (error) {
                res.status(500).send("An error occurred while fetching the landing page.");
            }
        });

        // Setup route for displaying the form to create a new resource
        this.app.get(router.get_url_paths.create, async (req, res) => {
            try {
                const formHtml = await resource.getNewResourceFormHtml();

                const Breadcrumb_page_collection: breadcrumb_type[] = [...Breadcrumb,
                {
                    label: resource.slug,
                    value: router.get_url_paths.index,
                },
                {
                    label: `Create new Resource`,
                    value: router.get_url_paths.create,
                },

                ];

                const html = pageBuilder.to_ejs(formHtml, this.createSidebarMenu(), Breadcrumb_page_collection);
                res.send(html);
            } catch (error) {
                res.status(500).send("An error occurred while fetching the new resource form.");
            }
        });
        // Setup route for submitting the form to create a new resource
        this.app.post(router.post_url_paths.create, async (req, res) => {
            try {
                // Assuming `createResource` method exists
                const rid = await resource.cms_ops_createResource(req.body);

                if (rid.error) {
                    return res.send(rid.error);
                }

                const url = replaceColonParamsPattern(router.get_url_paths.show, rid.success as string);
                res.redirect(url);

                res.redirect(router.get_url_paths.index);
            } catch (error) {
                res.status(500).send("An error occurred while creating a new resource.");
            }
        });

        // Setup route for displaying the form to edit a resource
        this.app.get(router.get_url_paths.edit, async (req, res) => {
            try {
                const id_param = req.params.id;
                const formHtml = await resource.get_EditResourceFormHTML(id_param);



                const Breadcrumb_page_collection: breadcrumb_type[] = [...Breadcrumb,
                {
                    label: resource.slug,
                    value: router.get_url_paths.index,
                },
                {
                    label: `Edit Resource - ${id_param}`,
                    value: replaceColonParamsPattern(router.get_url_paths.edit, id_param),
                },

                ];

                const html = pageBuilder.to_ejs(formHtml, this.createSidebarMenu(), Breadcrumb_page_collection);
                res.send(html);
            } catch (error) {
                res.status(500).send("An error occurred while fetching the edit form.");
            }
        });

        // Setup route for submitting the form to update a resource
        this.app.post(router.post_url_paths.edit, async (req, res) => {
            try {
                const id_param = req.params.id;

                const rid = await resource.cms_ops_updateResource(id_param, req.body);

                if (rid.error) {
                    return res.send(rid.error);
                }

                const url = replaceColonParamsPattern(router.get_url_paths.show, rid.success as string);
                res.redirect(url);
            } catch (error) {
                res.status(500).send("An error occurred while updating the resource.");
            }
        });


        // HTML representation
        this.app.get(router.get_url_paths.show, async (req, res) => {
            try {
                const id_param = req.params.id;

                const show_html = await resource.getShowResourceHTML(id_param);



                const Breadcrumb_page_collection: breadcrumb_type[] = [...Breadcrumb,
                {
                    label: resource.slug,
                    value: router.get_url_paths.index,
                },
                {
                    label: `Show Resource - ${id_param}`,
                    value: replaceColonParamsPattern(router.get_url_paths.show, id_param),
                },

                ];

                const html = pageBuilder.to_ejs(show_html, this.createSidebarMenu(), Breadcrumb_page_collection);
                res.send(html);

            } catch (error) {
                res.status(500).send("An error occurred while displaying the resource.");
            }
        });
        // Additional route setups can go here, possibly abstracting and iterating over a predefined list of routes in Resource_CMS
    }


    public init_setupRoutesForCMS() {
        this.app.get(this.controlPlaneUrls.dashboard, async (req, res) => {
            try {

                let landing_btns = /*template*/``;
                this.resources.forEach((r, index, array) => {
                    landing_btns += `\n` + r.get_side_menu_item_html() + `\n`;
                });

                const main_content = /*template*/`
<body class="bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
        <div class="container mx-auto px-4 py-6">
            <h1 class="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>
    </header>
    <!-- Main Content -->
    <main class="container mx-auto p-4">
        <!-- Introduction or Summary -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800">Quick Actions</h2>
            <p class="text-gray-600">Access the most common tasks directly from this dashboard.</p>
        </div>
        <!-- Button Grid Section -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <!-- Buttons will be dynamically inserted here -->
            ${landing_btns}
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white shadow mt-8">
        <div class="container mx-auto px-4 py-6">
            <p class="text-gray-600 text-sm text-center">© 2024 Your CMS Name. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>

                `;
                const pageBuilder = new EJS_Page();

                const landingHtml = pageBuilder.to_ejs(main_content, this.createSidebarMenu());
                res.send(landingHtml);
            } catch (error) {
                res.status(500).send("An error occurred while fetching the landing page.");
            }
        });
    }


    public createSidebarMenu(): string {
        let lateral_menu_items = /*template*/`

        <div class="MainNav w-24 h-full rounded bg-white flex-col justify-start items-center inline-flex font-['Montserrat']">
  
  <div class="List self-stretch h-96 flex-col justify-start items-start flex">

        `;
        this.resources.forEach((r, index, array) => {
            lateral_menu_items += `\n` + r.get_side_menu_item_html() + `\n`;
        });

        lateral_menu_items += /*template*/`
  </div>
</div>
        `;
        return lateral_menu_items;

    }

}


