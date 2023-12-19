export const locals = {
    foo: 'hola mundo!',
    chat_data_info: {

    },
    'include': `<% var main_content = include('main_content'); %>

<%- include('../Layouts/index', {
  header_content: header_content,
  aside: aside,
  main_content: main_content,
}) %>

`,
    variable: `
    
    ... code that is evaluated but not printed out.
<% var _ = js_code %>
<% var header_content = include('../components/header'); %>

    `
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
        {
            title: "AI Chat",
            icon: "chat",
            url_path: "/iiresodh/chat_app",
        },
        // {
        //   title: "Herramientas",
        //   icon: "tools",
        //   url_path: "/iiresodh/buscador",
        // },
    ],
    chat_data__LandingManifest: "ChatStarterManifest/Chat_landing",
};
// todo nfer type of ui data and set it to the globalCommons

export type GlobalCommons = typeof GlobalCommons_ui_data & {
    // other fields here
}