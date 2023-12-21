import { Express, Request, Response } from "express";
import morgan from "morgan";
import { CreateAssistantOptions } from "../ChatHTMX/AssistantsFactory";
import { FBR_ChatDBSupport } from "../ChatHTMX/DB/FBR_ChatDBSupport";
import { OpenAIAssistantSessionManager } from "../ChatHTMX/OpenAIAssistantSessionManager";
import { MainUtils } from "../HostMachine";
import { GlobalCommons, GlobalCommons_ui_data } from "./UI_TYPE";
import { register_routes_buscador } from "./routes/buscador_post";

/**
 * Resumen del archivo ExpressExporter.tsx
 *
 * - Clase: ExpressExporter
 * - Utiliza Express para manejar rutas y renderizar vistas
 * - Configura rutas GET y POST para el manejo de sesiones de chat
 * - Utiliza un ORM Prisma para la gesti�n de sesiones de usuario
 * - Configura un servidor Express para escuchar en el puerto 3000
 * - Proporciona una soluci�n para la gesti�n de mensajes de chat
 * - Permite el uso de EJS como motor de vistas
 * - Configura el middleware express-ejs-layouts
 * - Utiliza morgan para el manejo de logs
 * - Incluye funcionalidades adicionales para el manejo de otras acciones
 *
 * - Funciones de la clase:
 *   - constructor(args: { app: Express }): Constructor de la clase
 *   - private setupRoutes(): Configuración de rutas
 *   - private static default_server(): Configuración del servidor
 *   - Correcciones sugeridas para mejorar el manejo de rutas y vistas
 *   - Creación de sesiones de chat y gestión de mensajes
 */

const DB_NAME = "IIRESODH_test";
export class ExpressExporter {
  private app: Express;
  private sessionManager: OpenAIAssistantSessionManager;

  private prisma_wrapper = new FBR_ChatDBSupport(DB_NAME);

  constructor(args: { app: Express; views_drc: string }) {
    this.app = args.app;
    this.sessionManager = OpenAIAssistantSessionManager.getInstance();

    // TODO: add dev mode check
    // Set the directory for the views
    this.app.set("views", args.views_drc);

    // Set the view engine to EJS
    this.app.set("view engine", "ejs");

    this.setupRoutes();
  }

  private setupRoutes() {
    this.setupRoutesnit();
    this.setupChatRoutes();
    this.setupRoutesBuscador();
    register_routes_buscador(this.app);
  }
  private setupChatRoutes() {
    this.app.get("/iiresodh/chat_app", (req: Request, res: Response) => {
      // const { userId, title, options } = req.body;
      // const sessionData = this.sessionManager.createSession(
      //   userId,
      //   title,
      //   options as AssistantOptions
      // );
      // res.json(sessionData);

      // Adding /chat_app route
      // Render a view for the /chat_app route
      res.render("ChatApp/index_page", { ...this.get_ui_common_data() });
    });

    // This are chat related functons - debe ser heredadas, se puede hacer o
    this.app.get(
      "/iiresodh/chat_app/:userId",
      async (req: Request, res: Response) => {
        try {
          const { userId } = req.params;
          // Aquí debes recuperar los chats del usuario utilizando tu lógica de almacenamiento
          // Por ejemplo, supongamos que tienes una función llamada getChatsByUserId

          const userChats = await this.prisma_wrapper.get_user_sessions(userId);

          // Luego, renderiza una vista que muestre los chats en el nav bar del sidebar
          res.render("ChatApp/sidebar_chat_item_link_loop", {
            userChats: userChats,
            ...this.get_ui_common_data(),
          });
        } catch (error) {
          console.error(error);
          res.status(500).send("Server error occurred");
        }
      }
    );

    this.app.post(
      "/iiresodh/chat_app/htmx/session_create",
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
            "ChatApp/sidebar_chat_item_link",
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
      "/iiresodh/chat_app/htmx/session_view/:sessionId",
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

          res.render("ChatApp/index_page", {
            ...this.get_ui_common_data(),
            chat_data_info: { chat_messages, sessionId },
          });
        } else {
          res.render("ChatApp/index_page", {
            ...this.get_ui_common_data(),
            chat_data_info: { chat_messages: { data: [] }, sessionId },
          });
        }
      }
    );
  }

  public get_ui_common_data(): GlobalCommons {
    return { ...GlobalCommons_ui_data };
  }

  private setupRoutesnit() {
    // TODO: change this name of function
    // Existing route for "/iiresodh/"

    this.app.get("/iiresodh/", (req: Request, res: Response) => {
      res.render("Landing/index_page", { ...this.get_ui_common_data() });
    });

    this.app.get("/iiresodh/repositorio", (req: Request, res: Response) => {
      res.render("Repositorio/index_page", {
        ...this.get_ui_common_data(),
      });
    });
    this.app.get("/iiresodh/diagramas/:id", (req: Request, res: Response) => {
      res.render("Diagrama/index_page", {
        ...this.get_ui_common_data(),
      });
    });

    // Redirect from "/" to "/iiresodh/"
    this.app.get("/", (req: Request, res: Response) => {
      res.redirect("/iiresodh/");
    });
  }

  private setupRoutesBuscador() {
    this.app.get("/iiresodh/buscador", (req: Request, res: Response) => {
      res.render("Buscador/index_page", {
        ...this.get_ui_common_data(),
      });
    });
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
      const views_drc = MainUtils.root_directory("src/IIRESODH/views");
      app.use(express.urlencoded({ extended: true }));
      // Initialize all Express tool exporter functionalities
      const express_exporter = new ExpressExporter({
        app: app,
        views_drc,
      });

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
    const express_server = ExpressExporter.default_server();

    // Import Inquirer within the async function if it's not already imported
    // TODO: Update the swagger registry and routes with the ngrok URL
    // [Your logic to update Swagger registry and routes goes here]
  })();
}
