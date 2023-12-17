import { Express, Request, Response } from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import { MainUtils } from "../HostMachine";
import { CreateAssistantOptions } from "./AssistantsFactory";
import { FBR_GlobalPrisma } from "./DB/PrismaManager";
import { OpenAIAssistantSessionManager } from "./OpenAIAssistantSessionManager";
export class ExpressOpenAIAssistantSessionExporter {
  private app: Express;
  private sessionManager: OpenAIAssistantSessionManager;

  private prisma_wrapper = FBR_GlobalPrisma.getInstance();

  constructor(args: { app: Express }) {
    this.app = args.app;
    this.sessionManager = OpenAIAssistantSessionManager.getInstance();

    // Use expressLayouts middleware
    this.app.use(expressLayouts);

    // Set the directory for the views
    this.app.set("views", MainUtils.root_directory("src/ChatHTMX/views"));

    // Set the view engine to EJS
    this.app.set("view engine", "ejs");

    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.get("/chat_app/htmx", (req: Request, res: Response) => {
      // const { userId, title, options } = req.body;
      // const sessionData = this.sessionManager.createSession(
      //   userId,
      //   title,
      //   options as AssistantOptions
      // );
      // res.json(sessionData);

      // Adding /chat_app route
      // Render a view for the /chat_app route
      res.render("chat_app", { layout: "base_layout" });
    });

    this.app.get("/chat_app/:userId", async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        // Aquí debes recuperar los chats del usuario utilizando tu lógica de almacenamiento
        // Por ejemplo, supongamos que tienes una función llamada getChatsByUserId

        const userChats = await this.prisma_wrapper.get_user_sessions(userId);

        // Luego, renderiza una vista que muestre los chats en el nav bar del sidebar
        res.render("sidebar_chat_item_link_loop", { userChats: userChats });
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error occurred");
      }
    });

    this.app.post(
      "/chat_app/htmx/session_create",
      async (req: Request, res: Response) => {
        try {
          const { userId, title } = req.body;
          const sessionData = this.sessionManager.createSession(
            userId,
            title,
            CreateAssistantOptions()
          );

          await sessionData.asistant_wrap.get_or_create_assistant();

          const new_session_data =
            await this.prisma_wrapper.create_user_session({
              assistantId: sessionData.asistant_wrap.assistantId as string,
              userId: userId,
              title,
            });

          res.render(
            "sidebar_chat_item_link",
            { chat: new_session_data },
            (err, html) => {
              if (err) {
                // Handle the error, for example, by sending an error response
                console.error(err);
                res.status(500).send("Error rendering the page");
              } else {
                // html is the rendered content
                const renderedContent = html;
                res.send(renderedContent);
              }
            }
          );
        } catch (error) {
          console.error(error);
          res.status(500).send("Server error occurred");
        }
      }
    );

    this.app.get(
      "/chat_app/htmx/session_view/:sessionId",
      async (req: Request, res: Response) => {
        const { sessionId } = req.params;

        const session_data = await this.prisma_wrapper.get_session(sessionId);

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

          res.render("chat_app", {
            layout: "base_layout",
            chat_data_info: { chat_messages, sessionId },
          });
        } else {
          res.render("chat_app", {
            layout: "base_layout",
            chat_data_info: { chat_messages: { data: [] }, sessionId },
          });
        }
      }
    );

    this.app.post(
      "/chat_app/htmx/session_view/action/new_user_message",
      async (req: Request, res: Response) => {
        try {
          const { content, sessionId } = req.body;

          const session_data = await this.prisma_wrapper.get_session(sessionId);

          if (!session_data) {
            return res.status(404).send("Session not found");
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
            await this.prisma_wrapper.update_session_threadId(
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

          res.render("chat_chatlog_messages", {
            chat_data_info: { chat_messages, sessionId },
          });
        } catch (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
        }
      }
    );
  }

  // Métodos adicionales para manejar otras funcionalidades pueden ser añadidos aquí

  public static default_server() {
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
      const express_exporter = new ExpressOpenAIAssistantSessionExporter({
        app: app,
      });
      express_exporter.setupRoutes();

      // Start the server
      const port = 3000; // Replace with your desired port
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
    const express_server =
      ExpressOpenAIAssistantSessionExporter.default_server();

    // Import Inquirer within the async function if it's not already imported
    // TODO: Update the swagger registry and routes with the ngrok URL
    // [Your logic to update Swagger registry and routes goes here]
  })();
}
