export type MaybePromise<TType> = Promise<TType> | TType;


export type HTML_OR_ERROR = {
    success?: string;
    error?: string;
}
