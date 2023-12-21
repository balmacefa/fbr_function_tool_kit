// import { CreateAssistantOptions } from "../ChatHTMX";


export abstract class ExpressBaseExporter {
    abstract common_data: any;

    public extractFirstKeyValues(arr: Record<string, string>[]) {
        if (arr.length === 0) {
            return [];
        }

        const firstObject = arr[0];
        const firstKey = Object.keys(firstObject)[0];

        if (!firstKey) {
            return [];
        }

        return arr.map(item => item[firstKey]);
    }
    public get_ui_common_data() { return this.common_data }

    // abstract __default_server(): void;
    abstract setupRoutes(): void;
    abstract routes_definitions(): any;
}