import { MainUtils } from "../HostMachine";
import { Here_add } from "./HerePath";
import { OmMonoBehaviour } from "./MonoBehaviour";


export type UINodeProps = {
    name: string;
    nodeType: string;
    config: any;
    inputs: NodeInputOutput[];
    outputs: NodeInputOutput[];
};

export class UINode extends OmMonoBehaviour {

    public nodeType: string;
    public config: any;
    public inputs: NodeInputOutput[];
    public outputs: NodeInputOutput[];

    constructor(args: UINodeProps) {
        super();
        this.nodeType = args.nodeType;
        this.config = args.config;
        this.inputs = args.inputs;
        this.outputs = args.outputs;
    }
    async toHtml(): Promise<string> {
        const template = Here_add('NodesUI.ejs');
        const path_content = MainUtils.read_file_from_absolute_path(template);
        const html = await MainUtils.render_ejs_path_file(path_content, {});
        return html;
    }

    OnStart(): void {
        // Example: Processing inputs and determining next node(s)
        this.processInputs();
    }

    private processInputs(): void {
        // Logic to process inputs
        // Example: Read data from inputs, perform operations
    }

    // Other methods...
    OnRegisterEvent(): { key: string; func_call_back: any; } {
        throw new Error("Method not implemented.");
    }
    OnPublishEvent(): { key: string; } {
        throw new Error("Method not implemented.");
    }
}

class NodeInputOutput {
    public name: string;
    public type: string;
    public data: any;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
        this.data = null;
    }

    // Methods to handle data...
}
