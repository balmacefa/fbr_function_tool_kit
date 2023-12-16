import { Express, Request, Response } from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import { MainUtils } from "../HostMachine";
import { get_task_master_assistant_options } from "./AssistantsFactory";
import { OpenAIAssistantSessionManager } from "./OpenAIAssistantSessionManager";
export class ExpressOpenAIAssistantSessionExporter {
  // TODO export html routes
  private app: Express;
  private sessionManager: OpenAIAssistantSessionManager;

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
      const { userId } = req.params;
      // Aquí debes recuperar los chats del usuario utilizando tu lógica de almacenamiento
      // Por ejemplo, supongamos que tienes una función llamada getChatsByUserId
      const userChats = this.sessionManager.getChatsByUserId(userId);

      // Luego, renderiza una vista que muestre los chats en el nav bar del sidebar
      try {
        let renderedContents = [];

        try {
          // Map each session to a promise that resolves to the rendered string
          const renderPromises = userChats.map((chat) => {
            return new Promise((resolve, reject) => {
              res.render(
                "sidebar_chat_item_link",
                { title: chat.title, id: chat.id },
                (err, html) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(html);
                  }
                }
              );
            });
          });

          // Wait for all render promises to resolve
          renderedContents = await Promise.all(renderPromises);

          // At this point, renderedContents is an array of rendered strings
          // You can now process or send these as needed
          res.send(renderedContents.join(""));
        } catch (error) {
          // Handle any errors that occurred during rendering
          res.status(500).send("Error rendering the pages");
        }

        res.render("sidebar_chat_item_link", { id: "123", title: "hola chat" });
      } catch (error) {
        console.error(error);
      }
    });

    this.app.post(
      "/chat_app/htmx/session_create",
      (req: Request, res: Response) => {
        const { userId, title } = req.body;
        const sessionData = this.sessionManager.createSession(
          userId,
          title,
          get_task_master_assistant_options()
        );

        // Render the chat item using EJS and store it in a constant
        res.render(
          "sidebar_chat_item_link",
          { id: sessionData.id, title: "new chat" },
          (err, html) => {
            if (err) {
              // Handle the error, for example, by sending an error response
              console.error(err);
              res.status(500).send("Error rendering the page");
            } else {
              // html is the rendered content
              const renderedContent = html;

              // You can now use the renderedContent for further processing or logging
              // ...

              // Send the rendered content to the client
              res.send(renderedContent);
            }
          }
        );
      }
    );

    // const sessionData = sessionManager.createSession('@balmacefa', 'TaskMaster', options);

    // TODO create /chat_app/htmx/session_view/${sessionData.id}

    this.app.get(
      "/session/:userId/:sessionId",
      (req: Request, res: Response) => {
        const { userId, sessionId } = req.params;
        const sessionData = this.sessionManager.getSession(userId, sessionId);
        if (sessionData) {
          res.json(sessionData);
        } else {
          res.status(404).send("Session not found");
        }
      }
    );

    this.app.get(
      "/chat_app/htmx/session_view/:chat_id",
      async (req: Request, res: Response) => {
        const { chat_id } = req.params;

        const { userId, title } = req.body;
        const sessionData = this.sessionManager.createSession(
          userId,
          title,
          get_task_master_assistant_options()
        );

        // lets say we get it.
        const threadId = "asst_TTVGhin54h5KxYETTMugb1qO";
        await sessionData.asistant_wrap.get_or_create_assistant(threadId);
        // them get messages
        const chat_messages = await sessionData.asistant_wrap.get_chat_messages(
          threadId
        );

        // TODO convert this into tailwind messages

        // res.render(
        //   "sidebar_chat_item_link",
        //   { id: sessionData.id, title: "new chat" },
        //   (err, html) => {
        //     if (err) {
        //       // Handle the error, for example, by sending an error response
        //       console.error(err);
        //       res.status(500).send("Error rendering the page");
        //     } else {
        //       // html is the rendered content
        //       const renderedContent = html;

        //       // You can now use the renderedContent for further processing or logging
        //       // ...

        //       // Send the rendered content to the client
        //       res.send(renderedContent);
        //     }
        //   }
        // );

        res.render("chat_app", {
          layout: "base_layout",
          chat_data_info: { id: chat_id },
        });
      }
    );

    this.app.get("/sessions/:userId", (req: Request, res: Response) => {
      const { userId } = req.params;
      const sessions = this.sessionManager.listUserSessions(userId);
      res.json(sessions);
    });

    this.app.delete(
      "/session/:userId/:sessionId",
      async (req: Request, res: Response) => {
        const { userId, sessionId } = req.params;
        const success = await this.sessionManager.deleteSession(
          userId,
          sessionId
        );
        if (success) {
          res.send("Session deleted");
        } else {
          res.status(404).send("Session not found or could not be deleted");
        }
      }
    );

    // Otros métodos de ruta pueden ser agregados aquí
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
