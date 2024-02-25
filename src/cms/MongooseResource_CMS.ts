import { DatabaseSupport } from "../ChatHTMX/DB/FBR_ChatDBSupport";
import { CMSCollectionConfig } from "./CollectionConfig";
import { Resource_CMS } from "./Resource_CMS";

export type mongo_db_timestamps_type = {
    createdAt?: string; // Assuming you want to include the date/time
    updatedAt?: string; // Assuming you want to include the date/time
}
export type mongo_db_resource_type = mongo_db_timestamps_type & {
    _id?: string; // Assuming you want to include the ID
    __v?: number;
}



export class MongooseResource_CMS extends Resource_CMS {



    constructor(args: {
        DBSupport: DatabaseSupport<any>,
        create_form_CMSCollectionConfig?: CMSCollectionConfig,
        edit_form_CMSCollectionConfig?: CMSCollectionConfig,
        list_item_CMSCollectionConfig?: CMSCollectionConfig,
        show_item_CMSCollectionConfig?: CMSCollectionConfig,
        slug: string,
    }) {
        super(args);
    }
}