import { ComposedField, FlatPaths } from '../../../siaj/src/cms/types';

export type FlatPaths_zod_GobalTableSchema = FlatPaths<{ data: pre_calificacion_json[], description: string }>;

const form_attributes = `
        id="G05Expediente_htmx_configsForm"
        hx-post=""
        `.trim();

export const SHOW_FIELDS: ComposedField<FlatPaths_zod_GobalTableSchema>[] =
    [
        {
            type: 'form',
            attributes: form_attributes,
            fields: [
                {
                    type: 'array',
                    data_path: 'data',
                    label: 'Table Header',
                    fields:
                    {
                        type: 'group_grid',
                        field_id: 'table_data',
                        fields: [
                            {
                                type: 'string',
                                data_path: 'data[i].article',
                                label: 'Artículo'
                            },
                            {
                                type: 'string',
                                data_path: 'data[i].name',
                                label: 'Nombre'
                            },
                            {
                                type: 'string',
                                data_path: 'data[i].description',
                                label: 'Descripción'
                            },
                        ]
                    },
                },
                {
                    type: 'text_area',
                    label: 'Descripcion',
                    data_path: 'description',
                },
                {
                    type: 'submit',
                }
            ]
        },

    ];

export const table_pre_calificacion = new CollectionConfig({
    render_mode: 'SHOW',
    show_fields: SHOW_FIELDS
});
