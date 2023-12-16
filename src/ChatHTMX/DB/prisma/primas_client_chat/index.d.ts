
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model FBR_ChatSessionData
 * 
 */
export type FBR_ChatSessionData = $Result.DefaultSelection<Prisma.$FBR_ChatSessionDataPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more FBR_ChatSessionData
 * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more FBR_ChatSessionData
   * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.fBR_ChatSessionData`: Exposes CRUD operations for the **FBR_ChatSessionData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FBR_ChatSessionData
    * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findMany()
    * ```
    */
  get fBR_ChatSessionData(): Prisma.FBR_ChatSessionDataDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.7.0
   * Query Engine version: 79fb5193cf0a8fdbef536e4b4a159cad677ab1b9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    FBR_ChatSessionData: 'FBR_ChatSessionData'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'fBR_ChatSessionData'
      txIsolationLevel: never
    },
    model: {
      FBR_ChatSessionData: {
        payload: Prisma.$FBR_ChatSessionDataPayload<ExtArgs>
        fields: Prisma.FBR_ChatSessionDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FBR_ChatSessionDataFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FBR_ChatSessionDataFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload>
          }
          findFirst: {
            args: Prisma.FBR_ChatSessionDataFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FBR_ChatSessionDataFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload>
          }
          findMany: {
            args: Prisma.FBR_ChatSessionDataFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload>[]
          }
          create: {
            args: Prisma.FBR_ChatSessionDataCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload>
          }
          createMany: {
            args: Prisma.FBR_ChatSessionDataCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.FBR_ChatSessionDataDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload>
          }
          update: {
            args: Prisma.FBR_ChatSessionDataUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload>
          }
          deleteMany: {
            args: Prisma.FBR_ChatSessionDataDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.FBR_ChatSessionDataUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.FBR_ChatSessionDataUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$FBR_ChatSessionDataPayload>
          }
          aggregate: {
            args: Prisma.FBR_ChatSessionDataAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateFBR_ChatSessionData>
          }
          groupBy: {
            args: Prisma.FBR_ChatSessionDataGroupByArgs<ExtArgs>,
            result: $Utils.Optional<FBR_ChatSessionDataGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.FBR_ChatSessionDataFindRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          aggregateRaw: {
            args: Prisma.FBR_ChatSessionDataAggregateRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          count: {
            args: Prisma.FBR_ChatSessionDataCountArgs<ExtArgs>,
            result: $Utils.Optional<FBR_ChatSessionDataCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model FBR_ChatSessionData
   */

  export type AggregateFBR_ChatSessionData = {
    _count: FBR_ChatSessionDataCountAggregateOutputType | null
    _min: FBR_ChatSessionDataMinAggregateOutputType | null
    _max: FBR_ChatSessionDataMaxAggregateOutputType | null
  }

  export type FBR_ChatSessionDataMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    threadId: string | null
    assistantId: string | null
  }

  export type FBR_ChatSessionDataMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    threadId: string | null
    assistantId: string | null
  }

  export type FBR_ChatSessionDataCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    threadId: number
    assistantId: number
    _all: number
  }


  export type FBR_ChatSessionDataMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    threadId?: true
    assistantId?: true
  }

  export type FBR_ChatSessionDataMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    threadId?: true
    assistantId?: true
  }

  export type FBR_ChatSessionDataCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    threadId?: true
    assistantId?: true
    _all?: true
  }

  export type FBR_ChatSessionDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FBR_ChatSessionData to aggregate.
     */
    where?: FBR_ChatSessionDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBR_ChatSessionData to fetch.
     */
    orderBy?: FBR_ChatSessionDataOrderByWithRelationInput | FBR_ChatSessionDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FBR_ChatSessionDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBR_ChatSessionData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBR_ChatSessionData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FBR_ChatSessionData
    **/
    _count?: true | FBR_ChatSessionDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FBR_ChatSessionDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FBR_ChatSessionDataMaxAggregateInputType
  }

  export type GetFBR_ChatSessionDataAggregateType<T extends FBR_ChatSessionDataAggregateArgs> = {
        [P in keyof T & keyof AggregateFBR_ChatSessionData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFBR_ChatSessionData[P]>
      : GetScalarType<T[P], AggregateFBR_ChatSessionData[P]>
  }




  export type FBR_ChatSessionDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FBR_ChatSessionDataWhereInput
    orderBy?: FBR_ChatSessionDataOrderByWithAggregationInput | FBR_ChatSessionDataOrderByWithAggregationInput[]
    by: FBR_ChatSessionDataScalarFieldEnum[] | FBR_ChatSessionDataScalarFieldEnum
    having?: FBR_ChatSessionDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FBR_ChatSessionDataCountAggregateInputType | true
    _min?: FBR_ChatSessionDataMinAggregateInputType
    _max?: FBR_ChatSessionDataMaxAggregateInputType
  }

  export type FBR_ChatSessionDataGroupByOutputType = {
    id: string
    userId: string
    title: string | null
    threadId: string | null
    assistantId: string
    _count: FBR_ChatSessionDataCountAggregateOutputType | null
    _min: FBR_ChatSessionDataMinAggregateOutputType | null
    _max: FBR_ChatSessionDataMaxAggregateOutputType | null
  }

  type GetFBR_ChatSessionDataGroupByPayload<T extends FBR_ChatSessionDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FBR_ChatSessionDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FBR_ChatSessionDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FBR_ChatSessionDataGroupByOutputType[P]>
            : GetScalarType<T[P], FBR_ChatSessionDataGroupByOutputType[P]>
        }
      >
    >


  export type FBR_ChatSessionDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    threadId?: boolean
    assistantId?: boolean
  }, ExtArgs["result"]["fBR_ChatSessionData"]>

  export type FBR_ChatSessionDataSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    threadId?: boolean
    assistantId?: boolean
  }


  export type $FBR_ChatSessionDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FBR_ChatSessionData"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string | null
      threadId: string | null
      assistantId: string
    }, ExtArgs["result"]["fBR_ChatSessionData"]>
    composites: {}
  }


  type FBR_ChatSessionDataGetPayload<S extends boolean | null | undefined | FBR_ChatSessionDataDefaultArgs> = $Result.GetResult<Prisma.$FBR_ChatSessionDataPayload, S>

  type FBR_ChatSessionDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FBR_ChatSessionDataFindManyArgs, 'select' | 'include' | 'distinct' > & {
      select?: FBR_ChatSessionDataCountAggregateInputType | true
    }

  export interface FBR_ChatSessionDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FBR_ChatSessionData'], meta: { name: 'FBR_ChatSessionData' } }
    /**
     * Find zero or one FBR_ChatSessionData that matches the filter.
     * @param {FBR_ChatSessionDataFindUniqueArgs} args - Arguments to find a FBR_ChatSessionData
     * @example
     * // Get one FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends FBR_ChatSessionDataFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, FBR_ChatSessionDataFindUniqueArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one FBR_ChatSessionData that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {FBR_ChatSessionDataFindUniqueOrThrowArgs} args - Arguments to find a FBR_ChatSessionData
     * @example
     * // Get one FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends FBR_ChatSessionDataFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FBR_ChatSessionDataFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first FBR_ChatSessionData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBR_ChatSessionDataFindFirstArgs} args - Arguments to find a FBR_ChatSessionData
     * @example
     * // Get one FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends FBR_ChatSessionDataFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, FBR_ChatSessionDataFindFirstArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first FBR_ChatSessionData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBR_ChatSessionDataFindFirstOrThrowArgs} args - Arguments to find a FBR_ChatSessionData
     * @example
     * // Get one FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends FBR_ChatSessionDataFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, FBR_ChatSessionDataFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more FBR_ChatSessionData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBR_ChatSessionDataFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findMany()
     * 
     * // Get first 10 FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fBR_ChatSessionDataWithIdOnly = await prisma.fBR_ChatSessionData.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends FBR_ChatSessionDataFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FBR_ChatSessionDataFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a FBR_ChatSessionData.
     * @param {FBR_ChatSessionDataCreateArgs} args - Arguments to create a FBR_ChatSessionData.
     * @example
     * // Create one FBR_ChatSessionData
     * const FBR_ChatSessionData = await prisma.fBR_ChatSessionData.create({
     *   data: {
     *     // ... data to create a FBR_ChatSessionData
     *   }
     * })
     * 
    **/
    create<T extends FBR_ChatSessionDataCreateArgs<ExtArgs>>(
      args: SelectSubset<T, FBR_ChatSessionDataCreateArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many FBR_ChatSessionData.
     *     @param {FBR_ChatSessionDataCreateManyArgs} args - Arguments to create many FBR_ChatSessionData.
     *     @example
     *     // Create many FBR_ChatSessionData
     *     const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends FBR_ChatSessionDataCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FBR_ChatSessionDataCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a FBR_ChatSessionData.
     * @param {FBR_ChatSessionDataDeleteArgs} args - Arguments to delete one FBR_ChatSessionData.
     * @example
     * // Delete one FBR_ChatSessionData
     * const FBR_ChatSessionData = await prisma.fBR_ChatSessionData.delete({
     *   where: {
     *     // ... filter to delete one FBR_ChatSessionData
     *   }
     * })
     * 
    **/
    delete<T extends FBR_ChatSessionDataDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, FBR_ChatSessionDataDeleteArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one FBR_ChatSessionData.
     * @param {FBR_ChatSessionDataUpdateArgs} args - Arguments to update one FBR_ChatSessionData.
     * @example
     * // Update one FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends FBR_ChatSessionDataUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, FBR_ChatSessionDataUpdateArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more FBR_ChatSessionData.
     * @param {FBR_ChatSessionDataDeleteManyArgs} args - Arguments to filter FBR_ChatSessionData to delete.
     * @example
     * // Delete a few FBR_ChatSessionData
     * const { count } = await prisma.fBR_ChatSessionData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends FBR_ChatSessionDataDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, FBR_ChatSessionDataDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FBR_ChatSessionData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBR_ChatSessionDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends FBR_ChatSessionDataUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, FBR_ChatSessionDataUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FBR_ChatSessionData.
     * @param {FBR_ChatSessionDataUpsertArgs} args - Arguments to update or create a FBR_ChatSessionData.
     * @example
     * // Update or create a FBR_ChatSessionData
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.upsert({
     *   create: {
     *     // ... data to create a FBR_ChatSessionData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FBR_ChatSessionData we want to update
     *   }
     * })
    **/
    upsert<T extends FBR_ChatSessionDataUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, FBR_ChatSessionDataUpsertArgs<ExtArgs>>
    ): Prisma__FBR_ChatSessionDataClient<$Result.GetResult<Prisma.$FBR_ChatSessionDataPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Find zero or more FBR_ChatSessionData that matches the filter.
     * @param {FBR_ChatSessionDataFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: FBR_ChatSessionDataFindRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a FBR_ChatSessionData.
     * @param {FBR_ChatSessionDataAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const fBR_ChatSessionData = await prisma.fBR_ChatSessionData.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: FBR_ChatSessionDataAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of FBR_ChatSessionData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBR_ChatSessionDataCountArgs} args - Arguments to filter FBR_ChatSessionData to count.
     * @example
     * // Count the number of FBR_ChatSessionData
     * const count = await prisma.fBR_ChatSessionData.count({
     *   where: {
     *     // ... the filter for the FBR_ChatSessionData we want to count
     *   }
     * })
    **/
    count<T extends FBR_ChatSessionDataCountArgs>(
      args?: Subset<T, FBR_ChatSessionDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FBR_ChatSessionDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FBR_ChatSessionData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBR_ChatSessionDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FBR_ChatSessionDataAggregateArgs>(args: Subset<T, FBR_ChatSessionDataAggregateArgs>): Prisma.PrismaPromise<GetFBR_ChatSessionDataAggregateType<T>>

    /**
     * Group by FBR_ChatSessionData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FBR_ChatSessionDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FBR_ChatSessionDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FBR_ChatSessionDataGroupByArgs['orderBy'] }
        : { orderBy?: FBR_ChatSessionDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FBR_ChatSessionDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFBR_ChatSessionDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FBR_ChatSessionData model
   */
  readonly fields: FBR_ChatSessionDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FBR_ChatSessionData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FBR_ChatSessionDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the FBR_ChatSessionData model
   */ 
  interface FBR_ChatSessionDataFieldRefs {
    readonly id: FieldRef<"FBR_ChatSessionData", 'String'>
    readonly userId: FieldRef<"FBR_ChatSessionData", 'String'>
    readonly title: FieldRef<"FBR_ChatSessionData", 'String'>
    readonly threadId: FieldRef<"FBR_ChatSessionData", 'String'>
    readonly assistantId: FieldRef<"FBR_ChatSessionData", 'String'>
  }
    

  // Custom InputTypes

  /**
   * FBR_ChatSessionData findUnique
   */
  export type FBR_ChatSessionDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * Filter, which FBR_ChatSessionData to fetch.
     */
    where: FBR_ChatSessionDataWhereUniqueInput
  }


  /**
   * FBR_ChatSessionData findUniqueOrThrow
   */
  export type FBR_ChatSessionDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * Filter, which FBR_ChatSessionData to fetch.
     */
    where: FBR_ChatSessionDataWhereUniqueInput
  }


  /**
   * FBR_ChatSessionData findFirst
   */
  export type FBR_ChatSessionDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * Filter, which FBR_ChatSessionData to fetch.
     */
    where?: FBR_ChatSessionDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBR_ChatSessionData to fetch.
     */
    orderBy?: FBR_ChatSessionDataOrderByWithRelationInput | FBR_ChatSessionDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FBR_ChatSessionData.
     */
    cursor?: FBR_ChatSessionDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBR_ChatSessionData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBR_ChatSessionData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FBR_ChatSessionData.
     */
    distinct?: FBR_ChatSessionDataScalarFieldEnum | FBR_ChatSessionDataScalarFieldEnum[]
  }


  /**
   * FBR_ChatSessionData findFirstOrThrow
   */
  export type FBR_ChatSessionDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * Filter, which FBR_ChatSessionData to fetch.
     */
    where?: FBR_ChatSessionDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBR_ChatSessionData to fetch.
     */
    orderBy?: FBR_ChatSessionDataOrderByWithRelationInput | FBR_ChatSessionDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FBR_ChatSessionData.
     */
    cursor?: FBR_ChatSessionDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBR_ChatSessionData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBR_ChatSessionData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FBR_ChatSessionData.
     */
    distinct?: FBR_ChatSessionDataScalarFieldEnum | FBR_ChatSessionDataScalarFieldEnum[]
  }


  /**
   * FBR_ChatSessionData findMany
   */
  export type FBR_ChatSessionDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * Filter, which FBR_ChatSessionData to fetch.
     */
    where?: FBR_ChatSessionDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FBR_ChatSessionData to fetch.
     */
    orderBy?: FBR_ChatSessionDataOrderByWithRelationInput | FBR_ChatSessionDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FBR_ChatSessionData.
     */
    cursor?: FBR_ChatSessionDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FBR_ChatSessionData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FBR_ChatSessionData.
     */
    skip?: number
    distinct?: FBR_ChatSessionDataScalarFieldEnum | FBR_ChatSessionDataScalarFieldEnum[]
  }


  /**
   * FBR_ChatSessionData create
   */
  export type FBR_ChatSessionDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * The data needed to create a FBR_ChatSessionData.
     */
    data: XOR<FBR_ChatSessionDataCreateInput, FBR_ChatSessionDataUncheckedCreateInput>
  }


  /**
   * FBR_ChatSessionData createMany
   */
  export type FBR_ChatSessionDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FBR_ChatSessionData.
     */
    data: FBR_ChatSessionDataCreateManyInput | FBR_ChatSessionDataCreateManyInput[]
  }


  /**
   * FBR_ChatSessionData update
   */
  export type FBR_ChatSessionDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * The data needed to update a FBR_ChatSessionData.
     */
    data: XOR<FBR_ChatSessionDataUpdateInput, FBR_ChatSessionDataUncheckedUpdateInput>
    /**
     * Choose, which FBR_ChatSessionData to update.
     */
    where: FBR_ChatSessionDataWhereUniqueInput
  }


  /**
   * FBR_ChatSessionData updateMany
   */
  export type FBR_ChatSessionDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FBR_ChatSessionData.
     */
    data: XOR<FBR_ChatSessionDataUpdateManyMutationInput, FBR_ChatSessionDataUncheckedUpdateManyInput>
    /**
     * Filter which FBR_ChatSessionData to update
     */
    where?: FBR_ChatSessionDataWhereInput
  }


  /**
   * FBR_ChatSessionData upsert
   */
  export type FBR_ChatSessionDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * The filter to search for the FBR_ChatSessionData to update in case it exists.
     */
    where: FBR_ChatSessionDataWhereUniqueInput
    /**
     * In case the FBR_ChatSessionData found by the `where` argument doesn't exist, create a new FBR_ChatSessionData with this data.
     */
    create: XOR<FBR_ChatSessionDataCreateInput, FBR_ChatSessionDataUncheckedCreateInput>
    /**
     * In case the FBR_ChatSessionData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FBR_ChatSessionDataUpdateInput, FBR_ChatSessionDataUncheckedUpdateInput>
  }


  /**
   * FBR_ChatSessionData delete
   */
  export type FBR_ChatSessionDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
    /**
     * Filter which FBR_ChatSessionData to delete.
     */
    where: FBR_ChatSessionDataWhereUniqueInput
  }


  /**
   * FBR_ChatSessionData deleteMany
   */
  export type FBR_ChatSessionDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FBR_ChatSessionData to delete
     */
    where?: FBR_ChatSessionDataWhereInput
  }


  /**
   * FBR_ChatSessionData findRaw
   */
  export type FBR_ChatSessionDataFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * FBR_ChatSessionData aggregateRaw
   */
  export type FBR_ChatSessionDataAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * FBR_ChatSessionData without action
   */
  export type FBR_ChatSessionDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FBR_ChatSessionData
     */
    select?: FBR_ChatSessionDataSelect<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const FBR_ChatSessionDataScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    threadId: 'threadId',
    assistantId: 'assistantId'
  };

  export type FBR_ChatSessionDataScalarFieldEnum = (typeof FBR_ChatSessionDataScalarFieldEnum)[keyof typeof FBR_ChatSessionDataScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type FBR_ChatSessionDataWhereInput = {
    AND?: FBR_ChatSessionDataWhereInput | FBR_ChatSessionDataWhereInput[]
    OR?: FBR_ChatSessionDataWhereInput[]
    NOT?: FBR_ChatSessionDataWhereInput | FBR_ChatSessionDataWhereInput[]
    id?: StringFilter<"FBR_ChatSessionData"> | string
    userId?: StringFilter<"FBR_ChatSessionData"> | string
    title?: StringNullableFilter<"FBR_ChatSessionData"> | string | null
    threadId?: StringNullableFilter<"FBR_ChatSessionData"> | string | null
    assistantId?: StringFilter<"FBR_ChatSessionData"> | string
  }

  export type FBR_ChatSessionDataOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    threadId?: SortOrder
    assistantId?: SortOrder
  }

  export type FBR_ChatSessionDataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FBR_ChatSessionDataWhereInput | FBR_ChatSessionDataWhereInput[]
    OR?: FBR_ChatSessionDataWhereInput[]
    NOT?: FBR_ChatSessionDataWhereInput | FBR_ChatSessionDataWhereInput[]
    userId?: StringFilter<"FBR_ChatSessionData"> | string
    title?: StringNullableFilter<"FBR_ChatSessionData"> | string | null
    threadId?: StringNullableFilter<"FBR_ChatSessionData"> | string | null
    assistantId?: StringFilter<"FBR_ChatSessionData"> | string
  }, "id">

  export type FBR_ChatSessionDataOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    threadId?: SortOrder
    assistantId?: SortOrder
    _count?: FBR_ChatSessionDataCountOrderByAggregateInput
    _max?: FBR_ChatSessionDataMaxOrderByAggregateInput
    _min?: FBR_ChatSessionDataMinOrderByAggregateInput
  }

  export type FBR_ChatSessionDataScalarWhereWithAggregatesInput = {
    AND?: FBR_ChatSessionDataScalarWhereWithAggregatesInput | FBR_ChatSessionDataScalarWhereWithAggregatesInput[]
    OR?: FBR_ChatSessionDataScalarWhereWithAggregatesInput[]
    NOT?: FBR_ChatSessionDataScalarWhereWithAggregatesInput | FBR_ChatSessionDataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FBR_ChatSessionData"> | string
    userId?: StringWithAggregatesFilter<"FBR_ChatSessionData"> | string
    title?: StringNullableWithAggregatesFilter<"FBR_ChatSessionData"> | string | null
    threadId?: StringNullableWithAggregatesFilter<"FBR_ChatSessionData"> | string | null
    assistantId?: StringWithAggregatesFilter<"FBR_ChatSessionData"> | string
  }

  export type FBR_ChatSessionDataCreateInput = {
    id?: string
    userId: string
    title?: string | null
    threadId?: string | null
    assistantId: string
  }

  export type FBR_ChatSessionDataUncheckedCreateInput = {
    id?: string
    userId: string
    title?: string | null
    threadId?: string | null
    assistantId: string
  }

  export type FBR_ChatSessionDataUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    assistantId?: StringFieldUpdateOperationsInput | string
  }

  export type FBR_ChatSessionDataUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    assistantId?: StringFieldUpdateOperationsInput | string
  }

  export type FBR_ChatSessionDataCreateManyInput = {
    id?: string
    userId: string
    title?: string | null
    threadId?: string | null
    assistantId: string
  }

  export type FBR_ChatSessionDataUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    assistantId?: StringFieldUpdateOperationsInput | string
  }

  export type FBR_ChatSessionDataUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    assistantId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type FBR_ChatSessionDataCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    threadId?: SortOrder
    assistantId?: SortOrder
  }

  export type FBR_ChatSessionDataMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    threadId?: SortOrder
    assistantId?: SortOrder
  }

  export type FBR_ChatSessionDataMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    threadId?: SortOrder
    assistantId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use FBR_ChatSessionDataDefaultArgs instead
     */
    export type FBR_ChatSessionDataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FBR_ChatSessionDataDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}