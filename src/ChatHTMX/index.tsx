import { Express } from "express";
import expressLayouts from "express-ejs-layouts";
import { z } from "zod";
import { MainUtils } from "../HostMachine";
import { ToolFunction } from "../ToolFunction";

// Function to configure Express to use EJS
function configureEjs(app: Express) {
  // Use expressLayouts middleware
  app.use(expressLayouts);

  // Set the directory for the views
  app.set("views", MainUtils.root_directory("src\\ChatHTMX\\views_template"));

  // Set the view engine to EJS
  app.set("view engine", "ejs");

  // Adding /chat_app route
  app.get("/chat_app", (req, res) => {
    // Render a view for the /chat_app route
    res.render("chat_app");
  });

  // // Example usage
  // const app = express();
  // configureEjs(app);
}

// The rest of your Express server setup...

export const ChatHTMX_toolset = (): ToolFunction => {
  // Define the input and output schema

  const response_schema = z.string();

  type IOResponse = Promise<z.infer<typeof response_schema>>;

  // Define the tool function
  const tool_fn = async (): IOResponse => {
    try {
      // Load the conversation history from memory
      // Return the chatbot's response
      return "{ response: response.content.toString() };";
    } catch (error) {
      throw new Error(`Error in Tool_chat_session: ${error}`);
    }
  };

  // Create and return the new ToolFunction
  return new ToolFunction<undefined, IOResponse>(
    "Tool_chat_session",
    "Interactive chat session tool",
    tool_fn,
    undefined,
    response_schema
  );
};
