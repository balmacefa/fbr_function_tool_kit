import { MainRType } from "../../Sever/ExpressExporter";
import { ui_fields_new_expediente_electronico } from "../../routes/expediente_electronico/Expediente_electronico_DBSupport";
import { CollectionConfig } from "../CollectionConfig";
import { ComposedField } from "../types";


const _url_G05_pre_calificacion_ai_report: MainRType['expediente_electronico__ai_custom_G05_pre_calificacion_ai_report'] =
    '/ExpedienteElectronico/custom/G05_pre_calificacion_ai_report';

export const G05Expediente_htmx_configs_EDIT = (resource_id: string, R: MainRType) => {

    const form_attributes = `
        
        id="G05Expediente_htmx_configsForm"
        hx-post="${R.expediente_electronico_edit_partials}"
        `.trim();

    const EDIT_FIELDS: ComposedField<ui_fields_new_expediente_electronico>[] =
        [
            {
                type: 'custom',
                partials: 'G05_pre_calificacion_ai_report',
                data: {
                    post: _url_G05_pre_calificacion_ai_report
                }
            },
            {
                type: 'form',
                attributes: form_attributes,
                fields: [
                    {
                        type: 'form_hidden',
                        value: resource_id,
                        name: 'id',
                    },
                    {
                        type: 'group_grid',
                        fields: [
                            {
                                type: 'string',
                                label: 'Categoría',
                                data_path: 'G05_pre_calificacion.categoria'
                            },
                            {
                                type: 'string',
                                label: 'subcategoria',
                                data_path: 'G05_pre_calificacion.subcategoria'
                            },
                            {
                                type: 'string',
                                label: 'Temática',
                                data_path: 'G05_pre_calificacion.tematica'
                            },
                        ]
                    },
                    {
                        type: 'select_multiple',
                        label: 'Lista violación de derechos humanos',
                        data_path: 'G05_pre_calificacion.lista_supuestos_derechos_violentados',
                        options: [
                            {
                                label: 'D001- Derecho a la Vida',
                                value: 'd001_derecho_a_la_vida'
                            },
                            // Existing human rights options
                            {
                                "label": "D002- Derecho a la Libertad",
                                "value": "d002_derecho_a_la_libertad"
                            },
                            {
                                "label": "D003- Derecho a la Igualdad",
                                "value": "d003_derecho_a_la_igualdad"
                            },
                            {
                                "label": "D004- Derecho a la No Discriminación",
                                "value": "d004_derecho_a_la_no_discriminacion"
                            },
                            {
                                "label": "D005- Derecho a la Libertad de Pensamiento, Conciencia y Religión",
                                "value": "d005_derecho_a_la_libertad_de_pensamiento_conciencia_y_religion"
                            },
                            {
                                "label": "D006- Derecho a la Libertad de Opinión y Expresión",
                                "value": "d006_derecho_a_la_libertad_de_opinion_y_expresion"
                            },
                            {
                                "label": "D007- Derecho a la Reunión y Asociación",
                                "value": "d007_derecho_a_la_reunion_y_asociacion"
                            },
                            {
                                "label": "D008- Derecho a la Libertad de Movimiento",
                                "value": "d008_derecho_a_la_libertad_de_movimiento"
                            },
                            {
                                "label": "D009- Derecho a la Seguridad Personal",
                                "value": "d009_derecho_a_la_seguridad_personal"
                            },
                            {
                                "label": "D010- Derecho a la Privacidad",
                                "value": "d010_derecho_a_la_privacidad"
                            },
                            {
                                "label": "D011- Derecho a la Protección de la Familia",
                                "value": "d011_derecho_a_la_proteccion_de_la_familia"
                            },
                            {
                                "label": "D012- Derecho a la Educación",
                                "value": "d012_derecho_a_la_educacion"
                            },
                            {
                                "label": "D013- Derecho al Empleo",
                                "value": "d013_derecho_al_empleo"
                            },
                            {
                                "label": "D014- Derecho a la Seguridad Social",
                                "value": "d014_derecho_a_la_seguridad_social"
                            },
                            {
                                "label": "D015- Derecho a la Salud",
                                "value": "d015_derecho_a_la_salud"
                            },
                            {
                                "label": "D016- Derecho a la Alimentación",
                                "value": "d016_derecho_a_la_alimentacion"
                            },
                            {
                                "label": "D017- Derecho a la Vivienda",
                                "value": "d017_derecho_a_la_vivienda"
                            },
                            {
                                "label": "D018- Derecho a un Medio Ambiente Saludable",
                                "value": "d018_derecho_a_un_medio_ambiente_saludable"
                            },
                            {
                                "label": "D019- Derecho a la Participación en la Vida Pública",
                                "value": "d019_derecho_a_la_participacion_en_la_vida_publica"
                            },
                            {
                                "label": "D020- Derecho a la Justicia",
                                "value": "d020_derecho_a_la_justicia"
                            },

                            // Additional human rights options
                            {
                                "label": "D021- Derecho a la Cultura",
                                "value": "d021_derecho_a_la_cultura"
                            },
                            {
                                "label": "D022- Derecho al Recreo",
                                "value": "d022_derecho_al_recreo"
                            },
                            {
                                "label": "D023- Derecho a la Protección de los Intereses Morales y Materiales de los Autores",
                                "value": "d023_derecho_a_la_proteccion_de_los_intereses_morales_y_materiales_de_los_autores"
                            },
                            {
                                "label": "D024- Derecho a la Protección de la Propiedad Intelectual",
                                "value": "d024_derecho_a_la_proteccion_de_la_propiedad_intelectual"
                            },
                            {
                                "label": "D025- Derecho a la Protección de los Derechos de los Trabajadores",
                                "value": "d025_derecho_a_la_proteccion_de_los_derechos_de_los_trabajadores"
                            },
                            {
                                "label": "D026- Derecho a la Protección de los Derechos de los Niños",
                                "value": "d026_derecho_a_la_proteccion_de_los_derechos_de_los_ninos"
                            },
                            {
                                "label": "D027- Derecho a la Protección de los Derechos de las Personas con Discapacidad",
                                "value": "d027_derecho_a_la_proteccion_de_los_derechos_de_las_personas_con_discapacidad"
                            },
                            {
                                "label": "D028- Derecho a la Protección de los Derechos de las Personas Mayores",
                                "value": "d028_derecho_a_la_proteccion_de_los_derechos_de_las_personas_mayores"
                            },
                            {
                                "label": "D029- Derecho a la Protección de los Derechos de las Personas Migrantes",
                                "value": "d029_derecho_a_la_proteccion_de_los_derechos_de_las_personas_migrantes"
                            },
                            {
                                "label": "D030- Derecho a la Protección de los Derechos de las Personas Refugiadas",
                                "value": "d030_derecho_a_la_proteccion_de_los_derechos_de_las_personas_refugiadas"
                            },

                            // Country/region-specific violations (e.g., Costa Rica)
                            {
                                "label": "D031- Violación del Derecho a la Libertad de Expresión",
                                "value": "d031_violacion_del_derecho_a_la_libertad_de_expresion"
                            },
                            {
                                "label": "D032- Violación del Derecho a la Asociación",
                                "value": "d032_violacion_del_derecho_a_la_asociacion"
                            },
                            {
                                "label": "D033- Violación del Derecho a la No Discriminación",
                                "value": "d033_violacion_del_derecho_a_la_no_discriminacion"
                            },
                            {
                                "label": "D034- Violación del Derecho a la Propiedad",
                                "value": "d034_violacion_del_derecho_a_la_propiedad"
                            },
                            {
                                "label": "D035- Violación del Derecho al Medio Ambiente",
                                "value": "d035_violacion_del_derecho_al_medio_ambiente"
                            },

                            // Emerging or technology-related violations
                            {
                                "label": "D036- Violación del Derecho a la Privacidad Digital",
                                "value": "d036_violacion_del_derecho_a_la_privacidad_digital"
                            },
                            {
                                "label": "D037- Violación del Derecho a la Libertad de Expresión Digital",
                                "value": "d037_violacion_del_derecho_a_la_libertad_de_expresion_digital"
                            },
                            {
                                "label": "D038- Violación del Derecho a la No Discriminación Digital",
                                "value": "d038_violacion_del_derecho_a_la_no_discriminacion_digital"
                            }
                        ],

                    },
                    {
                        type: 'text_area',
                        label: 'Descripcion ',
                        data_path: 'G05_pre_calificacion.descripcion',
                    },
                    {
                        type: 'submit',
                    }
                ]
            },
        ];

    return new CollectionConfig<ui_fields_new_expediente_electronico>({
        title: 'G05 - Pre Calificación',
        edit_fields: EDIT_FIELDS,
        render_mode: 'EDIT'
    });
};


export const G05Expediente_htmx_configs_SHOW = () => {

    const SHOW_FIELDS: ComposedField<ui_fields_new_expediente_electronico>[] =
        [
            {
                type: 'string',
                label: 'Categoría',
                data_path: 'G05_pre_calificacion.categoria'
            },
            {
                type: 'string',
                label: 'subcategoria',
                data_path: 'G05_pre_calificacion.subcategoria'
            },
            {
                type: 'string',
                label: 'Temática',
                data_path: 'G05_pre_calificacion.tematica'
            },
            {
                type: 'ul',
                label: 'Lista violación de derechos humanos',
                data_path: 'G05_pre_calificacion.lista_supuestos_derechos_violentados',
            },
            {
                type: 'text_area',
                label: 'Descripcion',
                data_path: 'G05_pre_calificacion.descripcion',
            },
        ];

    return new CollectionConfig<ui_fields_new_expediente_electronico>({
        title: 'G05 - Pre Calificación',
        render_mode: 'SHOW',
        show_fields: SHOW_FIELDS
    });
};
