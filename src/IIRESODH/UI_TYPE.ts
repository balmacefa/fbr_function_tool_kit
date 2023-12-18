export const locals = {
    foo: 'hola mundo!',
    chat_data_info: {

    }
}

export const GlobalCommons_ui_data = {
    menu_list: [
        {
            title: "Buscador",
            icon: "search",
            url_path: "/iiresodh/buscador",
        },
        {
            title: "Repositorio",
            icon: "document",
            url_path: "/iiresodh/repositorio",
        },
        // {
        //   title: "Herramientas",
        //   icon: "tools",
        //   url_path: "/iiresodh/buscador",
        // },
    ],
};
// todo nfer type of ui data and set it to the globalCommons

export type GlobalCommons = typeof GlobalCommons_ui_data & {
    // other fields here
}