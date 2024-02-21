import { MaybePromise } from '../types';
export interface IBaseCMSResource {
    // Método para retornar el HTML del menú lateral
    getSidebarHtml(): MaybePromise<string>;

    // Método para retornar el HTML del botón de landing
    getLandingButtonHtml(): MaybePromise<string>;

    // Método para retornar el contenido del index de landing
    // Podría retornar un objeto con título, descripción y la tabla de recursos
    getLandingHtml(): MaybePromise<string>;

    // Método para mostrar el formulario de creación de un nuevo recurso
    // Se separan los métodos para GET y POST
    getNewResourceFormHtml(): MaybePromise<string>;

    // Método para mostrar y procesar el formulario de edición de un recurso
    // Se separan los métodos para GET y POST
    getEditResourceFormHTML(hit: any): MaybePromise<string>;

    // Métodos para mostrar un recurso en HTML y JSON
    getShowResourceHTML(hit: any): void;
}
