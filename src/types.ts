export type MaybePromise<TType> = Promise<TType> | TType;



export type HTML_OR_ERROR =
    | { success: string; error?: never }
    | { success?: never; error: string };


export type MaybePromise_OR_ERROR<T> =
    | { success: MaybePromise<T>; error?: never }
    | { success?: never; error: string };
