import { Express } from "express";
import { EJS_Page } from "../EjsUtils/page";
import { Resource_CMS } from "./Resource_CMS"; // Assuming Resource_CMS is in the same directory

export class CMSControlPlane {
    public resources: Resource_CMS[] = [];
    public app: Express;

    public logo_html: string;

    constructor(args: { app: Express, logo_html: string }) {
        this.app = args.app;
        this.logo_html = args.logo_html;
    }


    /**
     * Dynamically sets up Express routes for a given CMS resource.
     * @param identifier A unique identifier for the resource.
     * @param resource The Resource_CMS instance.
     */
    public setupRoutesForResource(identifier: string, resource: Resource_CMS) {
        // Example: Setup a route for the resource's landing page
        this.app.get(`/cms/${identifier}`, async (req, res) => {
            try {
                const resourcelandingHtml = await resource.getLandingHtml();

                const pageBuilder = new EJS_Page();

                const html = pageBuilder.to_ejs(resourcelandingHtml, this.generate_lateral_menu());
                res.send(html);

            } catch (error) {
                res.status(500).send("An error occurred while fetching the landing page.");
            }
        });

        // Additional route setups can go here, possibly abstracting and iterating over a predefined list of routes in Resource_CMS
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


    public render_landing_cms(locals: any) {
        this.app.get(`/cms/`, async (req, res) => {
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

}


