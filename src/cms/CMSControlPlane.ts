import { Express } from "express";
import { replaceColonParamsPattern } from "../ChatHTMX";
import { EJS_Page } from "../EjsUtils/page";
import { Resource_CMS } from "./Resource_CMS"; // Assuming Resource_CMS is in the same directory
import { set_cms_control_plane_urls, set_resource_urls } from "./url_string_generator";


// todo create a method to add a new reoutce and call the init_set_resource_urls with url_prefix

export class CMSControlPlane {
    public resources: Resource_CMS[] = [];
    public app: Express;

    public logo_html: string;

    public url_prefix = `admin`;

    private controlPlaneUrls: ReturnType<typeof set_cms_control_plane_urls>;


    constructor(args: {
        app: Express,
        logo_html: string,
        url_prefix?: string
    }) {
        this.url_prefix = args.url_prefix || `admin`;
        this.app = args.app;
        this.logo_html = args.logo_html;

        this.controlPlaneUrls = set_cms_control_plane_urls(this.url_prefix);

    }


    /**
     * Dynamically sets up Express routes for a given CMS resource.
     * @param identifier A unique identifier for the resource.
     * @param resource The Resource_CMS instance.
     */
    public init_setupRoutesForResource(slug: string, resource: Resource_CMS) {

        const router = set_resource_urls(slug, this.url_prefix);

        // Example: Setup a route for the resource's landing page
        this.app.get(router.get_url_paths.index, async (req, res) => {
            try {
                const resourcelandingHtml = await resource.getLandingHtml();

                const pageBuilder = new EJS_Page();

                const html = pageBuilder.to_ejs(resourcelandingHtml, this.generate_lateral_menu());
                res.send(html);

            } catch (error) {
                res.status(500).send("An error occurred while fetching the landing page.");
            }
        });

        // Setup route for displaying the form to create a new resource
        this.app.get(router.get_url_paths.create, async (req, res) => {
            try {
                const formHtml = await resource.getNewResourceFormHtml();
                res.send(formHtml);
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
                res.send(formHtml);
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

                const html = await resource.getShowResourceHTML(id_param);
                res.send(html);
            } catch (error) {
                res.status(500).send("An error occurred while displaying the resource.");
            }
        });
        // Additional route setups can go here, possibly abstracting and iterating over a predefined list of routes in Resource_CMS
    }


    public render_landing_cms() {
        this.app.get(this.controlPlaneUrls.dashboard, async (req, res) => {
            try {

                let landing_btns = /*template*/``;
                this.resources.forEach((r, index, array) => {
                    landing_btns += `\n` + r.getSidebarHtml() + `\n`;
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

                const landingHtml = pageBuilder.to_ejs(main_content, this.generate_lateral_menu());
                res.send(landingHtml);
            } catch (error) {
                res.status(500).send("An error occurred while fetching the landing page.");
            }
        });
    }


    public generate_lateral_menu(): string {
        let lateral_menu_items = /*template*/`

        <div class="MainNav w-24 h-full rounded bg-white flex-col justify-start items-center inline-flex font-['Montserrat']">
  <div class="Frame2055 h-48 px-3.5 pt-12 pb-16 flex-col justify-start items-center flex">
    <a href="/">
      ${this.logo_html}
    </a>

  </div>
  <div class="List self-stretch h-96 flex-col justify-start items-start flex">

        `;
        this.resources.forEach((r, index, array) => {
            lateral_menu_items += `\n` + r.getSidebarHtml() + `\n`;
        });

        lateral_menu_items += /*template*/`
  </div>
</div>
        `;
        return lateral_menu_items;

    }

}


