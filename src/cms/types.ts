import type { EmptyObject, IsAny, IsNever, NonRecursiveType, StaticPartOfArray, ToString, UnknownArray, VariablePartOfArray } from 'type-fest';


// import type { NonRecursiveType, StaticPartOfArray, ToString, VariablePartOfArray } from './internal';




// https://github.com/sindresorhus/type-fest
export type FieldOption = {
    label: string;
    value: string;
};

export interface BaseField<T> {
    data_path?: T;
    name?: string;
    label?: string;
    type: string;
    field_id?: string;
}

export interface StringField<T> extends BaseField<T> {
    type: 'string' | 'text_area' | 'ul';
    // Add other specific properties for text fields if necessary
    data_path: T;
    label: string;
}

export interface SelectField<T> extends BaseField<T> {
    type: 'select' | 'select_multiple';
    options: FieldOption[];
}

export interface CheckboxField<T> extends BaseField<T> {
    type: 'checkbox';
    data_path: T;
    label: string;
}

export interface TextareaField<T> extends BaseField<T> {
    type: 'textarea';
}

export interface ArrayField<T> extends BaseField<T> {
    type: 'array';
    data_path: T;
    label: string;

    minRows?: number;
    maxRows?: number;
    fields: StringField<T> | GroupField<T>;
}

export interface CollapsibleField<T> extends BaseField<T> {
    type: 'collapsible';
    fields: ComposedField<T>[];
}

export interface GroupField<T> extends BaseField<T> {
    type: 'group_grid';
    field_id: string;
    fields: ComposedField<T>[];
}
export interface FormField<T> extends BaseField<T> {
    type: 'form';
    fields: ComposedField<T>[];
    attributes: string;
}

export interface CustomField {
    type: 'custom';
    partials: string;
    data: any;
}
export interface TableField<T> {
    type: 'table';
    data: T;
    group_grid_table_schema_field_id: string;
    label: 'Label'
}
export interface SubmitField {
    type: 'submit';
}

export interface FormIdField {
    type: 'form_hidden';
    value: string;
    name: string
}

export type ComposedField<T> = TableField<T> | SubmitField | FormIdField | FormField<T> | CustomField | StringField<T> | SelectField<T> | CheckboxField<T> | TextareaField<T> | ArrayField<T> | CollapsibleField<T> | GroupField<T>;




// import dataJson = require('./data.json');
// ReadonlyDeep<typeof dataJson>
/**
Generate a union of all possible paths to properties in the given object.

It also works with arrays.

Use-case: You want a type-safe way to access deeply nested properties in an object.

@example
```
import type {Paths} from 'type-fest';
import NonRecursiveType from 'type-fest';

type Project = {
    filename: string;
    listA: string[];
    listB: [{filename: string}];
    folder: {
        subfolder: {
            filename: string;
        };
    };
};

type ProjectPaths = Paths<Project>;
//=> 'filename' | 'listA' | 'listB' | 'folder' | `listA.${number}` | 'listB.0' | 'listB.0.filename' | 'folder.subfolder' | 'folder.subfolder.filename'

declare function open<Path extends ProjectPaths>(path: Path): void;

open('filename'); // Pass
open('folder.subfolder'); // Pass
open('folder.subfolder.filename'); // Pass
open('foo'); // TypeError

// Also works with arrays
open('listA.1'); // Pass
open('listB.0'); // Pass
open('listB.1'); // TypeError. Because listB only has one element.
```

@category Object
@category Array
*/
export type Paths<T> =
    T extends NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
    ? never
    : IsAny<T> extends true
    ? never
    : T extends UnknownArray
    ? number extends T['length']
    ? InternalPaths<StaticPartOfArray<T>>
    | InternalPaths<VariablePartOfArray<T>[number][]>
    | InternalPaths<VariablePartOfArray<T>[number][]>
    : InternalPaths<T>
    : T extends object
    ? InternalPaths<T>
    : never;

export type InternalPaths<_T, T = Required<_T>, str_pattern extends string = '[i].'> =
    T extends EmptyObject | readonly []
    ? never
    : {
        [Key in keyof T]:
        Key extends string | number // Limit `Key` to string or number.
        ?
        | (Key extends number ? never : Key)
        | ToString<Key>
        | (
            IsNever<Paths<T[Key]>> extends false
            ? `${Key extends number ? str_pattern : Key}${Paths<T[Key]>}`
            : never
        )
        : never
    }[keyof T & (T extends UnknownArray ? number : unknown)];


export type PrefixedSuffixedPaths<T, Prefix extends string = "", Suffix extends string = ""> = {
    [P in Paths<T>]: `${Prefix}${P}${Suffix}`
}[Paths<T>];

export type FlatPaths<T, Prefix extends string = "", Suffix extends string = ""> = {
    [P in Paths<T>]: `${Prefix}${P}${Suffix}`
}[Paths<T>];
