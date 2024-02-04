import { Here_htmx } from "./EJS_RenderEngine/HerePath";
import { RenderEngine_ejs } from "./EJS_RenderEngine/ejs_render_tool_class";
import { OmMonoBehaviour } from "./MonoBehaviour";
import { UINode, UINodeProps } from "./UINode";

export class NodeRunner {
    OnRegisterEvent(): { key: string; func_call_back: any; } {
        throw new Error("Method not implemented.");
    }
    OnPublishEvent(): { key: string; } {
        throw new Error("Method not implemented.");
    }
    private nodes = new Map<string, OmMonoBehaviour>();


    OnStart() {

        return '';
    }

    private initializeNodes(jsonSchema: any): void {
        jsonSchema.nodes.forEach((nodeConfig: UINodeProps) => {
            const node = new UINode(nodeConfig);
            this.nodes.set(nodeConfig.name, node);
            // Add additional initialization as needed
        });
    }


    async handle_get_request() {
        const template = Here_htmx('NodesUI.ejs');
        return await (new RenderEngine_ejs()).render_entry_file(template);
    }

    static default_server() {
        import("express").then(async (express) => {
            const app = express.default(); // Note the use of .default here
            app.use(express.json()); // To support JSON-encoded bodies
            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.header(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PUT, DELETE, OPTIONS"
                );
                next();
            });

            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));


            // create NodeRunner,  and create a get route got the get request here
            const nodeRunner = new NodeRunner();

            app.get('/', async (req, res) => {
                try {
                    const result = await nodeRunner.handle_get_request();
                    res.send(result);
                } catch (error) {
                    res.status(500).send(error);
                }
            });

            // Start the server
            const port = `${process.env.PORT || 5000}`; // Replace with your desired port
            const server = app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });

            return server;
        });
    }

}



// // Function to configure Express to use EJS

if (typeof require !== "undefined" && require.main === module) {
    (() => {

        NodeRunner.default_server();
    })();
}
