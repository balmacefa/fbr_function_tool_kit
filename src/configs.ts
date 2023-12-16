
import { DataSource } from "typeorm";

export class FBR_Global_configs {
    private static instance: FBR_Global_configs;
    public mongo_connections: Map<string, DataSource>;

    public static MainKey = 'main';
    public static MongoBDConfigs: Map<string, {
        url: string;
    }>;

    // Constructor privado
    private constructor() {
        this.mongo_connections = new Map();

        FBR_Global_configs.MongoBDConfigs = new Map();
        FBR_Global_configs.MongoBDConfigs.set(FBR_Global_configs.MainKey, { url: `${process.env.MONGODB_URI}` });
    }

    // Método estático para acceder a la instancia
    public static getInstance(): FBR_Global_configs {
        if (!FBR_Global_configs.instance) {
            FBR_Global_configs.instance = new FBR_Global_configs();
        }
        return FBR_Global_configs.instance;
    }


    public static get_mongo_connection(connection = FBR_Global_configs.MainKey) {
        const tthis = FBR_Global_configs.getInstance();
        const conc = tthis.mongo_connections.get(connection);
        if (!conc) {
            const main_mongo_data_source = new DataSource({
                type: 'mongodb',
                ...FBR_Global_configs.MongoBDConfigs.get(FBR_Global_configs.MainKey)
            })

        }
    }
}