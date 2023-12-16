import { execa } from "execa";
import { MainUtils } from "../../HostMachine";
import { PrismaClient } from "./prisma/primas_client_chat";

export class FBR_GlobalPrisma {
    private static instance: FBR_GlobalPrisma;
    public mongo_connections: Map<string, any>;

    public static MainKey = 'main';
    public static MongoBDConfigs: Map<string, {
        url: string;
    }>;

    public prisma_client: PrismaClient;

    // Constructor privado
    private constructor() {
        this.mongo_connections = new Map();
        this.prisma_client = new PrismaClient()

        FBR_GlobalPrisma.MongoBDConfigs = new Map();
        FBR_GlobalPrisma.MongoBDConfigs.set(FBR_GlobalPrisma.MainKey, { url: `${process.env.MONGODB_URI}` });
    }

    // Método estático para acceder a la instancia
    public static getInstance(): FBR_GlobalPrisma {
        if (!FBR_GlobalPrisma.instance) {
            FBR_GlobalPrisma.instance = new FBR_GlobalPrisma();
        }
        return FBR_GlobalPrisma.instance;
    }
    public get_PrismaClient(connection = FBR_GlobalPrisma.MainKey) {
        const tthis = FBR_GlobalPrisma.getInstance();
        const conc = tthis.mongo_connections.get(connection);
    }

    public async GenerateClientDB() {
        const file_loc = MainUtils.root_directory('src\\ChatHTMX\\DB\\prisma\\schema.prisma');
        const cmd = `npx prisma generate --schema="${file_loc}"`
        console.log('**-------------------------------------**');
        const result = await execa(cmd);
        console.log(result.stdout);
        console.log('**-------------------------------------**');
    }
    public async InstropectDB() {
        const file_loc = MainUtils.root_directory('src\\ChatHTMX\\DB\\prisma\\schema.prisma');
        const cmd = `npx prisma db pull --schema="${file_loc}" --composite-type-depth=0`
        console.log('**-------------------------------------**');
        const result = await execa(cmd);
        console.log(result.stdout);
        console.log('**-------------------------------------**');
    }

    public static get_mongo_connection(connection = FBR_GlobalPrisma.MainKey) {
        const tthis = FBR_GlobalPrisma.getInstance();
        const conc = tthis.mongo_connections.get(connection);
        if (!conc) {
            // Todo: create a new mongo_prima main connection
        }
    }
}



if (typeof require !== "undefined" && require.main === module) {
    (async () => {
        const salsa = FBR_GlobalPrisma.getInstance();
        await salsa.GenerateClientDB();
        console.log('**Finished**');
        process.exit();
    })();
}
