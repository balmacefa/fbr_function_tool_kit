import { Express } from "express";
import { Resource_CMS } from "./Resource_CMS"; // Assuming Resource_CMS is in the same directory

export class CMSControlPlane {
    private resources: Map<string, Resource_CMS>;
    private app: Express;

    constructor(app: Express) {
        this.app = app;
        this.resources = new Map();
    }

    /**
     * Registers a new CMS resource with the control plane.
     * @param identifier A unique identifier for the resource.
     * @param resource An instance of Resource_CMS to be managed.
     */
    registerResource(identifier: string, resource: Resource_CMS) {
        if (this.resources.has(identifier)) {
            throw new Error(`Resource with identifier "${identifier}" already exists.`);
        }
        this.resources.set(identifier, resource);
        this.setupRoutesForResource(identifier, resource);
    }

    /**
     * Retrieves a registered CMS resource.
     * @param identifier The unique identifier for the resource.
     * @returns The requested Resource_CMS instance.
     */
    getResource(identifier: string): Resource_CMS | undefined {
        return this.resources.get(identifier);
    }

    /**
     * Dynamically sets up Express routes for a given CMS resource.
     * @param identifier A unique identifier for the resource.
     * @param resource The Resource_CMS instance.
     */
    private setupRoutesForResource(identifier: string, resource: Resource_CMS) {
        // Example: Setup a route for the resource's landing page
        this.app.get(`/cms/${identifier}`, async (req, res) => {
            try {
                const landingHtml = await resource.getLandingHtml();
                res.send(landingHtml);
            } catch (error) {
                res.status(500).send("An error occurred while fetching the landing page.");
            }
        });

        // Additional route setups can go here, possibly abstracting and iterating over a predefined list of routes in Resource_CMS
    }
}


