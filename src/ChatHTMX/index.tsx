import { Express } from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import { MainUtils } from "../HostMachine";

// Function to configure Express to use EJS
function configureEjs(app: Express) {
  // // Example usage
  // const app = express();
  // configureEjs(app);
}

// The rest of your Express server setup...

// export const ChatHTMX_toolset = (): ToolFunction => {
//   // Define the input and output schema

//   const response_schema = z.string();

//   type IOResponse = Promise<z.infer<typeof response_schema>>;

//   // Define the tool function
//   const tool_fn = async (): IOResponse => {
//     try {
//       // Load the conversation history from memory
//       // Return the chatbot's response
//       return "{ response: response.content.toString() };";
//     } catch (error) {
//       throw new Error(`Error in Tool_chat_session: ${error}`);
//     }
//   };

//   // Create and return the new ToolFunction
//   return new ToolFunction<undefined, IOResponse>(
//     "Tool_chat_session",
//     "Interactive chat session tool",
//     tool_fn,
//     undefined,
//     response_schema
//   );
// };

if (typeof require !== "undefined" && require.main === module) {
  (async () => {
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

      // Use expressLayouts middleware
      app.use(expressLayouts);

      // Set the directory for the views
      app.set("views", MainUtils.root_directory("src/ChatHTMX/views"));

      // Set the view engine to EJS
      app.set("view engine", "ejs");

      // Adding /chat_app route
      app.get("/", (req, res) => {
        // Render a view for the /chat_app route
        res.render("chat_app");
      });

      // Start the server
      const port = 3001; // Replace with your desired port
      const server = app.listen(port, async () => {
        console.log(`Server running on port ${port}`);
      });

      return server;
    });
    // Import Inquirer within the async function if it's not already imported
    // TODO: Update the swagger registry and routes with the ngrok URL
    // [Your logic to update Swagger registry and routes goes here]
  })();
}
