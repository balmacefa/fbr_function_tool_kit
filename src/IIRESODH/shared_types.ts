// This file contains type definitions shred between UI and Backend

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DocumentLangChain<Metadata extends Record<string, any> = Record<string, any>> {
    pageContent: string;
    metadata?: Metadata;
}

/////////////////////////////////////////////////////////////////
export enum SearchOptions {
    Content = 'content',
    Header = 'header',
}
export type TYPE_search_for = SearchOptions;

/////////////////////////////////////////////////////////////////

export enum EncoderOptions {
    Context = 'context',
    Details = 'details',
}
export type TYPE_encoder = EncoderOptions;


/////////////////////////////////////////////////////////////////
// API Inputs

export type order_by_list = 'datetime' | 'relevance' | '';

export type searchField_list = 'content' | 'header' | 'title';


export type chunkSizeMapping = {
    label: 'minimal' | 'compact' | 'standard' | 'extended' | 'maximal';
    value: 0 | 120 | 512 | 1024 | 1635;
};

// const chunkSizeList: chunkSizeMapping[] = [
//     { label: 'minimal', value: 0 },
//     { label: 'compact', value: 120 },
//     { label: 'standard', value: 512 },
//     { label: 'extended', value: 1024 },
//     { label: 'maximal', value: 1635 }
// ];

export type SelectedValuesType = {
    search_filters: {
        searchText: string;
        highlight: boolean;
        searchField: searchField_list;
        indexSize: chunkSizeMapping['value'];
    }
    sorting_options: {
        order_by: order_by_list;
        datetime_from: string;
        datetime_to: string;
    },
    filter_options: {
        classification: TesauroDerechoInternacional['classification'] | '',
        source_org: string,
        country: string,
        category: string,
        sub_category_1: string,
        sub_category_2: ''
    },
    page_options: {
        current_page: number;
        hits_limit: number;
    }
};


export type TYPE_post_embedding_search_body = SelectedValuesType;

export type TYPE_post_training_new_model = {
    IdFineTuning: string;
}
export type TYPE_post_run_training_model = {
    IdFineTuning: string;
    path: string;
    prompt: string;
}

export type ChatComands = "/resumir" | "/agent_1" | "/agent_2" | "/agent_3";
export type TYPE_post_chat_log = {
    comand: ChatComands;
    content: string;
    user_input: string;
}

// extends TYPE_post_embedding_search_body and add 'k:number'
export type TYPE_post_embedding_search_body_k = TYPE_post_embedding_search_body & {
    k: number;
}

// result from post
export type TYPE_post_embedding_search_result = TYPE_embedding_search_hit[];

/////////////////////////////////////////////////////////////////
export type post_result_handler_embedding_search = PaginationData & {
    hits: DocumentLangChain[]
}

/////////////////////////////////////////////////////////////////
export interface TreeviewDocumentHit {
    title: string;
    id: string;
}

export interface SubCategory2 {
    documents?: TreeviewDocumentHit[];
    [key: string]: SubCategory2 | TreeviewDocumentHit[] | undefined;
}

export interface SubCategory1 {
    documents?: TreeviewDocumentHit[];
    [key: string]: SubCategory2 | TreeviewDocumentHit[] | undefined;
}

export interface Category {
    documents?: TreeviewDocumentHit[];
    [key: string]: SubCategory1 | TreeviewDocumentHit[] | undefined;
}

export interface TreeView {
    [key: string]: Category | undefined;
}

export type TYPE_get_repository_treeview_result = TreeView


/////////////////////////////////////////////////////////////////


// create type
export type TYPE_embedding_search_hit = {
    metadata: {
        header: string;
        content: string;
        source: string;
    }
}

export interface Relationship {
    users: string;
}
export interface PaginationData {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: null | number;
    nextPage: null | number;
}

export interface Tag {
    tag_name: string;
    id: string;
}

export interface Document {
    id: string;
    name: string;
    description: string;
    tags: Tag[];
    category: 'word';  // Add additional categories as necessary
    relationship: {
        users: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface DocumentResponse {
    paginationData: PaginationData;
    docs: Document[];
}


export interface BucketResponse {
    paginationData: PaginationData;
    docs: [];
}

// TODO: Use the payload-types definition
export interface NormativaResponse {
    id: string;
    scraper_id: string;
    title: string;
    content: string;
    category: string;
    sub_category_1?: string;
    sub_category_2?: string;
    country: string;
    updatedAt: string;
    createdAt: string;
}

export type menu_tree_tesauro = {
    classification: string;
    countries: {
        country: string;
        categories: {
            category: string;
            sub_categories_1: {
                sub_category_1: string;
                sub_categories_2: string[];
            }[];
        }[];
    }[];
}[];



export const API_ROUTES = {
    digestos_search: {
        method: 'post' as const,
        path: `/embedding_search` as const,
        url: `/digestos_multi_type_col/embedding_search` as const,
    },
    digestos_search_gpt: {
        method: 'post' as const,
        path: `/BuscarJurisprudencia` as const,
        url: `/digestos_multi_type_col/BuscarJurisprudencia` as const,
    },
    repository_treeview: {
        method: 'get' as const,
        path: `/repository/treeview_normativa` as const,
        url: `/repository/treeview_normativa` as const,
    },
    tesaurio_menu_tree: {
        method: 'get' as const,
        path: `/tesaurio/menu_tree` as const,
        url: `/tesaurio/menu_tree` as const,
    },
    fine_tuning_new: {
        method: 'post' as const,
        path: `/fine_tuning/new` as const,
        url: `${SLUGS.FineTuningSets}/fine_tuning/new` as const,
    },
    run_fine_tuning: {
        method: 'post' as const,
        path: `/fine_tuning/run_model` as const,
        url: `${SLUGS.FineTuningSets}/fine_tuning/run_model` as const,
    },
    run_bautizo: {
        method: 'post' as const,
        path: `/fine_tuning/run_model/abutizo` as const,
        url: `${SLUGS.FineTuningSets}/fine_tuning/run_model/abutizo` as const,
    },
}