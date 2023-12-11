import { Express } from 'express';
import morgan from 'morgan';
import { ExpressToolExporter } from '../../ToolFunction/ExpressToolExporter';
import { ToolDirectoryVisualization, ToolFileContent } from '../../ToolFunction/tools/Directory.tools';
import { PluginManifest } from './PluginManifestGenerator';


export class ExpressToolExporter__lobe_chat extends ExpressToolExporter {


    static routePluginManifestDotJson__lobe_chat(args: { manifest: PluginManifest, app: Express }) {
        const jsonData = args.manifest.generateManifest();
        args.app.get('/lobe_chat_plugins/' + args.manifest.identifier + '.json', (req, res) => {
            res.status(201).json(jsonData);
        })

    }
    static routePluginGateway__lobe_chat(args: { manifest: PluginManifest, app: Express }) {
        // Convert the request and response to the expected format
        args.app.options('/api_gateway', async (req, res) => {
            const fakeRequest = {
                method: req.method,
                json: () => Promise.resolve(req.body),
                headers: {
                    get: (headerName: string) => req.headers[headerName.toLowerCase()],
                    // Add other header methods if needed by your original function
                },
            };

            // TODO: fix const fakeResponse = await createLobeChatPluginGateway()(fakeRequest as Request);

            // Assuming fakeResponse is similar to a Fetch API Response
            // if (fakeResponse.ok) {
            //     const responseBody = await fakeResponse.json(); // or .json()

            //     res.status(fakeResponse.status).send(responseBody);
            // } else {
            //     res.status(fakeResponse.status).send(fakeResponse.statusText);
            // }
        });

    }
    static initializeExpressToolExport__lobe_chat(args: {
        app: Express,
        manifest: PluginManifest
    }) {
        this.export_tools_routes({
            app: args.app,
            functions: args.manifest.functions
        });

        this.routePluginManifestDotJson__lobe_chat({
            app: args.app,
            manifest: args.manifest
        });

        this.routePluginGateway__lobe_chat({
            app: args.app,
            manifest: args.manifest
        })

        this.setupOpenAPISwaggerDocs(args.app, args.manifest.functions);
    }
}



if (typeof require !== 'undefined' && require.main === module) {
    import('express')
        .then(express => {

            const app = express.default(); // Note the use of .default here
            app.use(express.json()); // To support JSON-encoded bodies
            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                next();
            });

            app.use(
                morgan(":method :url :status :res[content-length] - :response-time ms")
            );

            // Create PluginManifest instance
            const plugin = new PluginManifest({
                gateway: '...',
                identifier: 'fbr_lobechat_01',
                version: '1.0.0',
                functions: [
                    ToolDirectoryVisualization(),
                    ToolFileContent()
                ],
                host: 'http://localhost:3000'
            });
            // Initialize all Express tool exporter functionalities
            ExpressToolExporter__lobe_chat.initializeExpressToolExport__lobe_chat({
                app: app,
                manifest: plugin
            });

            // Start the server
            const port = 3000; // Replace with your desired port
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
                app._router.stack.forEach((middleware: any) => {
                    if (middleware.route) { // if it's a route middleware
                        const methods = Object.keys(middleware.route.methods)
                            .map(method => method.toUpperCase())
                            .join(', ');
                        console.log(`${methods} ${middleware.route.path}`);
                    }
                });
            });
        });

}
