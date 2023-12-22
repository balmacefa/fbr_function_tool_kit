import { Express, Request, Response } from "express";
import morgan from "morgan";
// import { CreateAssistantOptions } from "../ChatHTMX";
import ejs from "ejs";
import _ from "lodash";
import { FBR_ChatDBSupport } from "../DB/FBR_ChatDBSupport";
import { GetChatView } from "../views/ViewsPath";
import { ExpressBaseExporter } from "./ExpressBaseExporter";



const DB_NAME = "IIRESODH_test";



import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Full_stack_Software_Architect, Tailwind_HTMX_alpine_jquery } from "../../Assistants/AssistantBase";
import { MainUtils } from "../../HostMachine";
import OpenAIAssistantWrapper, { AssistantManifest } from "../OpenAI/OpenAIAssistantWrapper";
export const CurrentPath = dirname(fileURLToPath(import.meta.url));





export class ExpressChatExporter extends ExpressBaseExporter {
    // private absolute_index_path: string;
    common_data: any;
    chat_manifests: AssistantManifest[];
    routes_definitions(): Record<string, string> {
        throw new Error("Method not implemented.");
    }
    private app: Express;
    // private sessionManager: OpenAIAssistantSessionManager;
    // private views_drc: string;
    private chat_db_wrapper = new FBR_ChatDBSupport({});
    R: Record<string, string>;


    constructor(args: { app: Express, manifests: AssistantManifest[], chat_landing_ejs_inject_on_locals__main_content?: string, sub_path_main: string, context_common_data: Record<string, string> }) {
        super();
        this.app = args.app;
        // this.sessionManager = OpenAIAssistantSessionManager.getInstance();

        // TODO: add dev mode check
        // Set the directory for the views

        this.chat_manifests = args.manifests;
        const { sub_path_main } = args;
        this.R = {

            chat: sub_path_main,
            chat__post_create_session: sub_path_main + "/htmx/session_create",
            chat__get_view_user_chat: sub_path_main + "/htmx/session_view/:sessionId",
            chat__post_new_user_message: sub_path_main + "/htmx/session_view/action/new_user_message",
            chat__get_user_chats: sub_path_main + "/:userId",

        };

        const combinned_common_data = _.merge({
            chat_manifests: this.chat_manifests,
            R: this.R,
            chat_landing_ejs: args.chat_landing_ejs_inject_on_locals__main_content ?
                args.chat_landing_ejs_inject_on_locals__main_content : GetChatView("index"),
        }, args.context_common_data);
        this.common_data = combinned_common_data
    }

    _getShowCaseAssistantManifest(): AssistantManifest[] {
        return this.chat_manifests.filter(el => (el.show_case && el.ejs_render_path))
    }

    renderShowCaseAssistantManifest(): AssistantManifest[] {
        const show_cases = this._getShowCaseAssistantManifest();

        show_cases.forEach(el => {
            el.renderHTML = ejs.render(el.ejs_render_path, el.ejs_variables)
        });

        return show_cases;
    }
    get_manifest_by_assistants_id(id: string) {
        return this.chat_manifests.find(el => el.name === id);
    }

    setupRoutes() {
        this.setupChatRoutes(this.R);
    }
    private setupChatRoutes(R: Record<string, string>) {
        this.app.get(R.chat, (req: Request, res: Response) => {
            // const { userId, title, options } = req.body;
            // const sessionData = this.sessionManager.createSession(
            //   userId,
            //   title,
            //   options as AssistantOptions
            // );
            // res.json(sessionData);

            // Adding /chat_app route
            // Render a view for the /chat_app route
            res.render(GetChatView("index_page"), { ...this.get_ui_common_data() });
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
                    res.render(GetChatView("sidebar_chat_item_link_loop"), {
                        userChats: userChats,
                        ...this.get_ui_common_data(),
                    });
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
                    // return error message
                    return res.render(GetChatView("error_message"), {
                        error___details: 'Manifest Not Found',
                        message_json: "Error on this.app.post(R.chat__post_create_session"
                    });
                }

                const asistant_wrap = new OpenAIAssistantWrapper(manifest);

                await asistant_wrap.get_or_create_assistant();

                const new_session_data =
                    await this.chat_db_wrapper.create_user_session({
                        assistantId: asistant_wrap.assistantId as string,
                        userId: userId,
                        title,
                        manifestId: manifest.name
                    });

                // R.chat__get_view_user_chat, set params to new_session_data.id

                const redirect_user = this.replacePattern(R.chat__get_view_user_chat, new_session_data.id);

                res.setHeader('HX-Redirect', redirect_user);
                res.status(200).send('redirect to header HX-Redirect');



                // res.render(
                //     GetChatView("sidebar_chat_item_link"),
                //     {
                //         ...this.get_ui_common_data(),
                //         chat: new_session_data,
                //     },
                //     (err, html) => {
                //         if (err) {
                //             // Handle the error, for example, by sending an error response
                //             console.error(err);
                //             return res.render(GetChatView("error_message"), {
                //                 error___details: 'Session not found',
                //                 message_json: err
                //             });
                //         } else {
                //             // html is the rendered content
                //             const renderedContent = html;
                //             res.send(renderedContent);
                //         }
                //     }
                // );

            } catch (error) {
                console.error(error);
                return res.render(GetChatView("error_message"), {
                    error___details: 'Session not created',
                    message_json: "Error on this.app.post(R.chat__post_create_session"
                });
            }
        }
        );


        this.app.post(R.chat__post_new_user_message,
            async (req: Request, res: Response) => {
                try {
                    const { content, sessionId } = req.body;

                    const session_data = await this.chat_db_wrapper.get_session(sessionId);

                    if (!session_data) {

                        return res.render(GetChatView("error_message"), {
                            error___details: 'Session not found',
                            message_json: "Error on this.app.post(R.chat__post_new_user_message"
                        });
                    }

                    const manifest = this.get_manifest_by_assistants_id(session_data.manifestId);

                    if (!manifest) {
                        // return error message
                        return res.render(GetChatView("error_message"), {
                            error___details: 'Session not created',
                            message_json: "Error on this.app.post(R.chat__post_new_user_message"
                        });
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

                    res.render(GetChatView("chat_chatlog_messages"), {
                        chat_data_info: { chat_messages, sessionId },
                        ...this.get_ui_common_data()
                    });
                } catch (error) {
                    console.error(error);
                    return res.render(GetChatView("error_message"), {
                        error___details: 'Server error occurred',
                        message_json: JSON.stringify((error as any)?.message)
                    });
                }
            }
        );

        this.app.get(R.chat__get_view_user_chat,
            async (req: Request, res: Response) => {
                try {
                    const { sessionId } = req.params;

                    const session_data = await this.chat_db_wrapper.get_session(sessionId);

                    if (!session_data) {

                        return res.render(GetChatView("error_message"), {
                            error___details: 'Session not found',
                            message_json: "Error on this.app.post(R.chat__get_view_user_chat"
                        });
                    }

                    const manifest = this.get_manifest_by_assistants_id(session_data.manifestId);

                    if (!manifest) {
                        // return error message
                        return res.render(GetChatView("error_message"), {
                            error___details: 'Manifest Not Found Error',
                            message_json: "Error on R.chat__get_view_user_chat"
                        });
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

                        res.render(GetChatView("index_page"), {
                            ...this.get_ui_common_data(),
                            chat_data_info: { chat_messages, sessionId },
                        });
                    } else {
                        res.render(GetChatView("index_page"), {
                            ...this.get_ui_common_data(),
                            chat_data_info: { chat_messages: { data: [] }, sessionId },
                        });
                    }
                } catch (error) {
                    console.error(error);
                    return res.render(GetChatView("error_message"), {
                        error___details: 'Server error occurred on R.chat__get_view_user_chat',
                        message_json: JSON.stringify((error as any)?.message)
                    });
                }
            }
        );
    }

    static default_server() {
        import("express").then((express) => {
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


            const list_of_agents: AssistantManifest[] = [
                Tailwind_HTMX_alpine_jquery(),
                Full_stack_Software_Architect(),
            ]

            // Initialize all Express tool exporter functionalities
            const express_exporter = new ExpressChatExporter({
                app: app,
                context_common_data: {},
                sub_path_main: '/chat_app',
                manifests: list_of_agents
            });
            express_exporter.setupRoutes();
            // Start the server
            const port = `${process.env.PORT || 5000}`; // Replace with your desired port
            const server = app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });

            return server;
        });
    }
}

// Function to configure Express to use EJS

if (typeof require !== "undefined" && require.main === module) {
    (() => {


        // Setup the MainUtils Root Direcotry for easy , copyrelative path integration
        const currentPath = path.join(path.join(CurrentPath, '../'));
        console.info('Current Main path', path.join()) // set it to the root of this sub project module!
        MainUtils.set_root_path(currentPath);


        ExpressChatExporter.default_server();
        // Import Inquirer within the async function if it's not already imported
        // TODO: Update the swagger registry and routes with the ngrok URL
        // [Your logic to update Swagger registry and routes goes here]
    })();
}
