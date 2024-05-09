import Markdoc, { Config, Schema } from '@markdoc/markdoc';
import { Express, Request, Response } from "express";
import _ from "lodash";
import morgan from "morgan";
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
import { Full_stack_Software_Architect, Tailwind_HTMX_alpine_jquery } from "../../Assistants/AssistantBase";
import { MainUtils } from '../../HostMachine';
import { FBR_ChatDBSupport } from "../DB/FBR_ChatDBSupport";
import OpenAIAssistantWrapper, { AssistantManifest } from "../OpenAI/OpenAIAssistantWrapper";
import { ChatHTMXViewsChatAppPath, GetChatView } from "../views/ViewsPath";
import { ExpressBaseExporter } from "./ExpressBaseExporter";


type RType = {
    chat: string;
    chat__post_create_session: string;
    chat__get_view_user_chat: string;
    chat__post_new_user_message: string;
    chat__get_user_chats: string;
    parse_markdoc: (str: string) => Promise<string>;
};

interface ThemeRenderType {
    full_page_with: (data: { content: string, breadcrumb: { label: string, value: string }[] }) => string;
}

export class ExpressChatExporter extends ExpressBaseExporter<RType> {
    chat_landing_ejs_inject_on_locals__main_content: string;
    R: RType;

    tr: ThemeRenderType;

    // private absolute_index_path: string;
    common_data: any;
    chat_manifests: AssistantManifest[];
    markdoc_components: Schema[];
    routes_definitions(): Record<string, string> {
        throw new Error("Method not implemented.");
    }
    // private sessionManager: OpenAIAssistantSessionManager;
    // private views_drc: string;
    private chat_db_wrapper = new FBR_ChatDBSupport({});

    constructor(args: {
        app: Express,
        manifests: AssistantManifest[],
        sub_path_main: string,
        context_common_data: Record<string, string>,
        markdoc_components: Schema[],
        chat_landing_ejs_inject_on_locals__main_content?: string
        themeRender: ThemeRenderType;
    }) {
        super({ app: args.app });

        if (args.markdoc_components.length === 0) {
            // throw new Error('markdoc_components is empty');
        }
        this.markdoc_components = args.markdoc_components;
        // this.sessionManager = OpenAIAssistantSessionManager.getInstance();


        this.tr = args.themeRender;

        // TODO: add dev mode check
        // Set the directory for the views

        this.chat_landing_ejs_inject_on_locals__main_content = args.chat_landing_ejs_inject_on_locals__main_content ? args.chat_landing_ejs_inject_on_locals__main_content : GetChatView("index_page");

        this.chat_manifests = args.manifests;
        const { sub_path_main } = args;
        this.R = {
            chat: sub_path_main,
            chat__post_create_session: sub_path_main + "/htmx/session_create",
            chat__get_view_user_chat: sub_path_main + "/htmx/session_view/:sessionId",
            chat__post_new_user_message: sub_path_main + "/htmx/session_view/action/new_user_message",
            chat__get_user_chats: sub_path_main + "/:userId",
            parse_markdoc: (str: string) => this.parse_markdoc(str),
        };

        const combinned_common_data = _.merge({
            chat_manifests: this.chat_manifests,
            R: this.R,
            index_ejs: this.chat_landing_ejs_inject_on_locals__main_content,
            GetChatView
        }, args.context_common_data);
        this.common_data = combinned_common_data
    }

    _getShowCaseAssistantManifest(): AssistantManifest[] {
        return this.chat_manifests.filter(el => (el.show_case))
    }

    async parse_markdoc(doc: string): Promise<string> {
        const ast = Markdoc.parse(doc);
        const config: Config = {
            tags: {
                // Curiosidad_rubik_cube
            },
            // nodes: {
            //     heading
            // },
            variables: {}
        };
        if (this.markdoc_components.length === 0) {
            throw new Error('markdoc_components is empty');
        }

        this.markdoc_components.forEach((value) => {
            if (config.tags) {
                config.tags[value.render as string] = value;
            }
        })

        const content = await Markdoc.transform(ast, config);

        const html = Markdoc.renderers.html(content);
        return html;
    }

    // renderShowCaseAssistantManifest(): AssistantManifest[] {
    //     const show_cases = this._getShowCaseAssistantManifest();

    //     show_cases.forEach(el => {
    //         el.renderHTML = ejs.render(el.ejs_render_path, el.ejs_variables)
    //     });

    //     return show_cases;
    // }
    get_manifest_by_assistants_id(id: string) {
        return this.chat_manifests.find(el => el.name === id);
    }

    async setupRoutes() {
        // lets init the mongo instance
        await this.chat_db_wrapper.init();
        this.setupChatRoutes(this.R);
    }
    private setupChatRoutes(R: RType) {

        this.app.get(R.chat, async (req: Request, res: Response) => {
            // const { userId, title, options } = req.body;
            // const sessionData = this.sessionManager.createSession(
            //   userId,
            //   title,
            //   options as AssistantOptions
            // );
            // res.json(sessionData);

            // Adding /chat_app route
            // Render a view for the /chat_app route
            const chat_app_html: string = await MainUtils.render_ejs_path_file(GetChatView('main_content'),
                {
                    ...this.get_ui_common_data(),
                });

            // add sent full from threnreder


            const breadcrumb = [
                {
                    label: 'Inicio',
                    value: '/'
                },
                {
                    label: 'Chat App',
                    value: '/chat_app'
                }
            ];
            const guided_tour = `<script src="/guided_tour/ventana_uno_GET_ver_expediente_electronico.js"></script>`;
            const html = this.tr.full_page_with({
                content: chat_app_html + guided_tour,
                breadcrumb: breadcrumb
            })

            res.send(html);
        });

        // This are chat related functons - debe ser heredadas, se puede hacer o
        this.app.get(R.chat__get_user_chats,
            async (req: Request, res: Response) => {
                try {
                    const { userId } = req.params;
                    // Aquí debes recuperar los chats del usuario utilizando tu lógica de almacenamiento
                    // Por ejemplo, supongamos que tienes una función llamada getChatsByUserId

                    const userChats = await this.chat_db_wrapper.get_user_sessions(userId);

                    // Luego, renderiza una vista que muestre los chats en el nav bar del sidebar

                    const html = await MainUtils.render_ejs_path_file(GetChatView("sidebar_chat_item_link_loop"), {
                        userChats: userChats,
                        ...this.get_ui_common_data(),
                    });
                    res.send(html);

                } catch (error) {
                    console.error(error);
                    res.status(500).send("Server error occurred");
                }
            }
        );

        this.app.post(R.chat__post_create_session, async (req: Request, res: Response) => {
            try {
                const { userId, title, asistant_id } = req.body;

                const manifest = this.get_manifest_by_assistants_id(asistant_id)

                if (!manifest) {


                    const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"),
                        {
                            error___details: 'Manifest Not Found',
                            message_json: "Error on this.app.post(R.chat__post_create_session"
                        });
                    return res.status(200).send(html);
                }

                const asistant_wrap = new OpenAIAssistantWrapper(manifest);

                await asistant_wrap.get_or_create_assistant(manifest.assistantId);

                const new_session_data =
                    await this.chat_db_wrapper.create_user_session({
                        assistantId: asistant_wrap.assistantId || '',
                        userId: userId,
                        title,
                        manifestId: manifest.name
                    });

                // R.chat__get_view_user_chat, set params to new_session_data.id

                const redirect_user = this.replacePattern(R.chat__get_view_user_chat, new_session_data.id);

                res.setHeader('HX-Redirect', redirect_user);
                res.status(200).send('redirect to header HX-Redirect');

            } catch (error) {

                const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"),
                    {
                        error___details: 'Manifest Not Found',
                        message_json: "Error on this.app.post(R.chat__post_create_session"
                    });
                return res.status(200).send(html);
            }
        }
        );


        this.app.post(R.chat__post_new_user_message,
            async (req: Request, res: Response) => {
                try {
                    const { content, sessionId } = req.body;

                    const session_data = await this.chat_db_wrapper.get_session(sessionId);

                    if (!session_data) {

                        const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"),
                            {
                                error___details: 'Manifest Not Found',
                                message_json: "Error on this.app.post(R.chat__post_new_user_message"
                            });
                        return res.status(200).send(html);
                    }

                    const manifest = this.get_manifest_by_assistants_id(session_data.manifestId);

                    if (!manifest) {

                        const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"),
                            {
                                error___details: 'Manifest Not Found',
                                message_json: "Error on this.app.post(R.chat__post_new_user_message"
                            });
                        return res.status(200).send(html);
                    }

                    const asistant_wrap = new OpenAIAssistantWrapper(manifest);
                    await asistant_wrap.get_or_create_assistant(session_data.assistantId);

                    const new_message = await asistant_wrap.execute_agent(
                        content,
                        session_data.threadId
                    );

                    if (!session_data.threadId) {
                        await this.chat_db_wrapper.update_session_threadId(
                            sessionId,
                            new_message.threadId
                        );
                    }
                    // load all messages and replace XD!
                    // them get messages
                    const chat_messages =
                        await asistant_wrap.get_chat_messages(
                            `${new_message.threadId}`
                        );


                    const html = await MainUtils.render_ejs_path_file(GetChatView("chat_chatlog_messages"),
                        {
                            chat_data_info: { chat_messages, sessionId },
                            ...this.get_ui_common_data()
                        });
                    return res.status(200).send(html);

                } catch (error) {

                    const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"),
                        {
                            error___details: 'Server error occurred',
                            message_json: JSON.stringify((error as any)?.message)
                        });
                    return res.status(200).send(html);
                }
            }
        );

        this.app.get(R.chat__get_view_user_chat,
            async (req: Request, res: Response) => {
                try {
                    const { sessionId } = req.params;

                    const session_data = await this.chat_db_wrapper.get_session(sessionId);

                    if (!session_data) {


                        const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"), {
                            error___details: 'Session not found',
                            message_json: "Error on this.app.post(R.chat__get_view_user_chat"
                        });
                        return res.status(200).send(html);
                    }

                    const manifest = this.get_manifest_by_assistants_id(session_data.manifestId);

                    if (!manifest) {


                        const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"), {
                            error___details: 'Manifest Not Found Error',
                            message_json: "Error on R.chat__get_view_user_chat"
                        });
                        return res.status(200).send(html);
                    }

                    const asistant_wrap = new OpenAIAssistantWrapper(manifest);
                    await asistant_wrap.get_or_create_assistant(session_data.assistantId);

                    const threadId = session_data?.threadId;

                    if (threadId) {
                        // them load the messages
                        await asistant_wrap.get_or_create_assistant(
                            session_data?.assistantId
                        );
                        // them get messages
                        const chat_messages =
                            await asistant_wrap.get_chat_messages(threadId);

                        const html = await MainUtils.render_ejs_path_file(GetChatView('index_page'),
                            {
                                ...this.get_ui_common_data(),
                                chat_data_info: { chat_messages, sessionId },
                            });

                        return res.status(200).send(html);

                    } else {

                        const html = await MainUtils.render_ejs_path_file(GetChatView("index_page"), {
                            ...this.get_ui_common_data(),
                            chat_data_info: { chat_messages: { data: [] }, sessionId },
                        });
                        return res.status(200).send(html);
                    }
                } catch (error) {
                    console.error(error);

                    const html = await MainUtils.render_ejs_path_file(GetChatView("error_message"), {
                        error___details: 'Server error occurred on R.chat__get_view_user_chat',
                        message_json: JSON.stringify((error as any)?.message)
                    });
                    return res.status(200).send(html);
                }
            }
        );
    }

    static default_server() {
        import("express").then(async (express) => {
            const app = express.default(); // Note the use of .default here
            app.use(express.json()); // To support JSON-encoded bodies
            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.header(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PUT, DELETE, OPTIONS"
                );
                next();
            });
            app.use(
                morgan(":method :url :status :res[content-length] - :response-time ms")
            );

            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));


            // Serve static files from the 'public' directory
            app.use(express.static(ChatHTMXViewsChatAppPath + '/public'));
            const list_of_agents: AssistantManifest[] = [
                Tailwind_HTMX_alpine_jquery(),
                Full_stack_Software_Architect(),
            ]

            // Initialize all Express tool exporter functionalities
            const express_exporter = new ExpressChatExporter({
                app: app,
                context_common_data: {},
                sub_path_main: '/chat_app',
                manifests: list_of_agents,
                markdoc_components: [],
                themeRender: {
                    full_page_with: ({ content, breadcrumb }) => {
                        return content;
                    }
                }
            });
            await express_exporter.setupRoutes();
            // Start the server
            const port = `${process.env.PORT || 5000}`; // Replace with your desired port
            const server = app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });

            return server;
        });
    }
}

// // Function to configure Express to use EJS

// if (typeof require !== "undefined" && require.main === module) {
//     (() => {


//         const CurrentPath = dirname(fileURLToPath(import.meta.url));

//         // Setup the MainUtils Root Direcotry for easy , copyrelative path integration
//         const currentPath = path.join(path.join(CurrentPath, '../'));
//         console.info('Current Main path', path.join()) // set it to the root of this sub project module!
//         MainUtils.set_root_path(currentPath);


//         ExpressChatExporter.default_server();
//         // Import Inquirer within the async function if it's not already imported
//         // TODO: Update the swagger registry and routes with the ngrok URL
//         // [Your logic to update Swagger registry and routes goes here]
//     })();
// }
