export const locals = {
    foo: 'hola mundo!',
    chat_data_info: {

    },
    'include': `
    
<% var main_content = include('main_content'); %>

<%- include('../Layouts/index', {
  header_content: header_content,
  aside: aside,
  main_content: main_content,
}) %>

<%- include('index') %>

`,
    for: `
    

 <% if(locals.countries) locals.countries.forEach(function(country) { %>
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          class="form-checkbox"
          name="country[]"
          value="<%= country.value %>"
        />
        <span class="ml-2"><%= country.name %></span>
      </label>
      <% }); %>

    `,
    variable: `
    
    ... code that is evaluated but not printed out.
<% var _ = js_code %>
<% var header_content = include('../components/header'); %>

    `,

    hit: {
        pageContent: "39.\tStates parties should report to the Committee on their national policy and legislation with regard to asylum seekers and refugees and gather, analyse and make available sex-disaggregated statistical data and trends over time on asylum claims, countries of origin, reasons for seeking asylum and recognition rates.",
        metadata: {
            _id: {
            },
            id: "65513433ba22f43e3760431a",
            classification: "jurisprudence",
            header: "National policy and legislation. Asylum seekers. Refugees. ",
            source: ".",
            source_org: "ONU",
            createdAt: "2023-11-12T20:23:17.018Z",
            updatedAt: "2023-11-12T20:23:17.018Z",
            interface_ts: "type_tesauro_derecho_internacional",
            document_id: "65513433ba22f43e3760431a",
            path: "header",
            chunk_size: 1024,
            target_collection: "tesauro_derecho_internacional",
            type: "one_path_one_document",
            is_chunk: true,
            loc: {
                lines: {
                    from: 1,
                    to: 1,
                },
            },
            chart_at_from: 0,
            chart_at_to: 59,
            chunk_index: 0,
            chunk_count: 1,
            country: "",
            category: "",
            sub_category_1: "",
            sub_category_2: "",
        },
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