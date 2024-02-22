

const _top_html = /*template*/ `

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>IIRESODH / SIAJ</title>


  <link rel="icon" href="https://iiresodh.org/contenido/uploads/2024/01/Isotipo_IIRESODH-512-100x100.jpg" sizes="32x32">

  <link rel="icon" href="https://iiresodh.org/contenido/uploads/2024/01/Isotipo_IIRESODH-512-100x100.jpg" sizes="32x32">

  <link href="/styles.css" rel="stylesheet">
  <link href="/user.css" rel="stylesheet">

  <!-- HTMX CDN -->
  <script src="https://unpkg.com/htmx.org"></script>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

  <script src="https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js" integrity="sha256-lSjKY0/srUM9BE3dPm+c4fBo1dky2v27Gdjm2uoZaL0=" crossorigin="anonymous"></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/themes/base/selectmenu.min.css">

  <!-- Showdown CDN , ths s a mardown render library, I using combined with jquery -->
  <script src="https://cdn.jsdelivr.net/npm/showdown@1.9.1/dist/showdown.min.js"></script>
  <!-- FontAwesome CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

  <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/font-awesome-line-awesome/css/all.min.css" />

  <link rel="stylesheet" href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css" />

  <!-- Fonts google -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <!-- class="font-['Montserrat']" -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap" rel="stylesheet" />
  <!-- class="font-['Montserrat']" -->


  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

  <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>


</head>

<body class="h-full min-h-screen">

`;


const _bottom_html = /*template*/ `

<!-- Footer can go here -->

<!-- Add your scripts here -->
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js" integrity="sha256-yPqP9Fer3NIS83oH7y8pLJmQEd/6vKpXf7Hh4Adsplg=" crossorigin="anonymous"></script>

<!-- <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/src/browserify.min.js"></script> -->

<!-- and it's easy to individually load additional languages -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/markdown.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ts.min.js"></script>



</body>

</html>
`;

export class EJS_Page {
    top_html: string;
    bottom_html: string;

    constructor(args?: {
        top_html?: string,
        bottom_html?: string
    }) {
        if (args) {
            if (args.top_html) {
                this.top_html = args.top_html;
            } else {
                this.top_html = _top_html;
            }
            if (args.bottom_html) {
                this.bottom_html = args.bottom_html;
            } else {
                this.bottom_html = _bottom_html;
            }
        } else {
            this.top_html = _top_html;
            this.bottom_html = _bottom_html;

        }
    }

    public to_ejs(content: string, aside?: string) {

        const template = /*template*/ `
${this.top_html}

<div class="h-full w-full">
    <!-- First column -->
    <div class="flex flex-col h-full">
        <!-- Header Content -->
        <header class="">
            <!-- header_content  -->
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

        return template;
    }

}