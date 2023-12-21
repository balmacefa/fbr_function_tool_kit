import { Express, Request, Response } from "express";
import morgan from "morgan";
// import { CreateAssistantOptions } from "../ChatHTMX";
import _ from "lodash";
import { CreateAssistantOptions } from "../AssistantsFactory";
import { FBR_ChatDBSupport } from "../DB/FBR_ChatDBSupport";
import { OpenAIAssistantSessionManager } from "../OpenAI/OpenAIAssistantSessionManager";
import { GetChatView } from "../views/Path";
import { ExpressBaseExporter } from "./ExpressBaseExporter";

const DB_NAME = "IIRESODH_test";



import { dirname } from 'path';
import { fileURLToPath } from 'url';
export const CurrentPath = dirname(fileURLToPath(import.meta.url));

export class ExpressChatExporter extends ExpressBaseExporter {
    // private absolute_index_path: string;
    common_data: any;
    routes_definitions(): Record<string, string> {
        throw new Error("Method not implemented.");
    }
    private app: Express;
    private sessionManager: OpenAIAssistantSessionManager;
    // private views_drc: string;
    private chat_db_wrapper = new FBR_ChatDBSupport(DB_NAME);
    R: Record<string, string>;


    constructor(args: { app: Express, chat_landing_ejs?: string, path_main: string, context_common_data: Record<string, string> }) {
        super();
        this.app = args.app;
        this.sessionManager = OpenAIAssistantSessionManager.getInstance();

        // TODO: add dev mode check
        // Set the directory for the views

        const sub_path_main = args.path_main + "/chat_app";
        this.R = {

            chat: sub_path_main,
            chat__post_create_session: sub_path_main + "/htmx/session_create",
            chat__get_view_user_chat: sub_path_main + "/htmx/session_view/:sessionId",
            chat__post_new_user_message: sub_path_main + "/htmx/session_view/action/new_user_message",
            chat__get_user_chats: sub_path_main + "/:userId",

        };

        const combinned_common_data = _.merge({
            R: this.R,
            chat_landing_ejs: args.chat_landing_ejs ? args.chat_landing_ejs : GetChatView("index"),
        }, args.context_common_data);
        this.common_data = combinned_common_data
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
                const { userId, title } = req.body;
                const sessionData = this.sessionManager.createSession(
                    userId,
                    title,
                    CreateAssistantOptions()
                );

                await sessionData.asistant_wrap.get_or_create_assistant();

                const new_session_data =
                    await this.chat_db_wrapper.create_user_session({
                        assistantId: sessionData.asistant_wrap.assistantId as string,
                        userId: userId,
                        title,
                    });

                res.render(
                    "ChatApp/sidebar_chat_item_link",
                    { chat: new_session_data },
                    (err, html) => {
                        if (err) {
                            // Handle the error, for example, by sending an error response
                            console.error(err);
                            return res.render(GetChatView("error_message"), {
                                error___details: 'Session not found',
                                message_json: err
                            });
                        } else {
                            // html is the rendered content
                            const renderedContent = html;
                            res.send(renderedContent);
                        }
                    }
                );
            } catch (error) {
                console.error(error);
                return res.render(GetChatView("error_message"), {
                    error___details: 'Session not created',
                    message_json: "Error on this.app.post(R.chat__post_new_user_message"
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

                    const sessionData = this.sessionManager.createSession(
                        session_data.userId as string,
                        session_data.title as string,
                        CreateAssistantOptions()
                    );

                    await sessionData.asistant_wrap.get_or_create_assistant(
                        session_data.assistantId
                    );

                    const new_message = await sessionData.asistant_wrap.execute_agent(
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
                        await sessionData.asistant_wrap.get_chat_messages(
                            `${new_message.threadId}`
                        );

                    res.render(GetChatView("chat_chatlog_messages"), {
                        chat_data_info: { chat_messages, sessionId },
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
                const { sessionId } = req.params;

                const session_data = await this.chat_db_wrapper.get_session(sessionId);

                const sessionData = this.sessionManager.createSession(
                    session_data?.userId as string,
                    session_data?.title as string,
                    CreateAssistantOptions()
                );

                const threadId = session_data?.threadId;

                if (threadId) {
                    // them load the messages
                    await sessionData.asistant_wrap.get_or_create_assistant(
                        session_data?.assistantId
                    );
                    // them get messages
                    const chat_messages =
                        await sessionData.asistant_wrap.get_chat_messages(threadId);

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
            // Initialize all Express tool exporter functionalities
            const express_exporter = new ExpressChatExporter({
                app: app,
                context_common_data: {},
                path_main: ''
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
        ExpressChatExporter.default_server();
        // Import Inquirer within the async function if it's not already imported
        // TODO: Update the swagger registry and routes with the ngrok URL
        // [Your logic to update Swagger registry and routes goes here]
    })();
}
