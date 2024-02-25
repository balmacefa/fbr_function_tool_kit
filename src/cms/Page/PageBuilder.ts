import { EJS_Page } from "../../EjsUtils/page";
export type breadcrumb_type = {
    label: string,
    value: string
};
export class EJS_PageWithBreadcrumb extends EJS_Page {
    // Nuevo método para construir el HTML del breadcrumb
    private createBreadcrumbHtml(breadcrumb: { label: string, value: string }[]) {
        const breadcrumbContainer = /*template*/`
    <nav aria-label="breadcrumb">
        <ol class="flex list-none p-0 rounded">
            ${breadcrumb.map((item, index) => {
            if (index === breadcrumb.length - 1) {
                // Último elemento, más oscuro y sin enlace
                return /*template*/`<li class="text-gray-500" aria-current="page">${item.label}</li>`;
            } else {
                // Elementos intermedios
                return /*template*/`<li class="mr-2"><a href="${item.value}" class="text-blue-600 hover:text-blue-800">${item.label}</a></li>`;
            }
        }).join('<li class="text-gray-500 mx-2">/</li>')} <!-- Separador -->
        </ol>
    </nav>
    `;

        return breadcrumbContainer;
    }


    public to_ejs(content: string, aside: string, breadcrumb: { label: string, value: string }[] = []) {


        const templateWithBreadcrumb = /*template*/`
${this.top_html}

<div class="h-full w-full">
    <!-- First column -->
    <div class="flex flex-col h-full">
        <!-- Header Content -->
        <header class="p-4">
            ${this.createBreadcrumbHtml(breadcrumb)} <!-- Incluye el breadcrumb aquí -->
        </header>
        <main class="flex flex-row h-full w-full">
            <aside>
                ${aside}
            </aside>
            <article class="container mx-auto p-4">
                ${content}
            </article>
        </main>
    </div>
</div>

${this.bottom_html}
`;

        return templateWithBreadcrumb;
    }
}
