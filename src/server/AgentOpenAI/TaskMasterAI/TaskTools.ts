import { FunctionalTool } from "../FunctionalTool";


const taskManagementFunction = new FunctionalTool(
    {
        function: {

            name: "TaskManagement",
            description: "Maneja la creación, actualización, y rechazo de tareas dentro de múltiples hilos de ejecución.",
            parameters: {
                type: "object",
                properties: {
                    taskId: { type: "string", description: "ID de la tarea" },
                    action: { type: "string", enum: ["create", "update", "reject"], description: "Acción a realizar en la tarea" },
                    taskDetails: { type: "object", description: "Detalles de la tarea para crear o actualizar" }
                },
                required: ["taskId", "action"]
            }
        },
        type: "function"
    },
    () => {
        return "Hello World";
    }
);




const feedbackCycleFunction = new FunctionalTool({
    function: {

        name: "FeedbackCycle",
        description: "Procesa el feedback de las tareas y sugiere ajustes.",
        parameters: {
            type: "object",
            properties: {
                feedbackData: { type: "object", description: "Datos de feedback para las tareas" }
            },
            required: ["feedbackData"]
        }
    },
    type: "function"
},
    () => {
        return "Hello World";
    });

// This func tool, ask if we have a tool to accomplish the task
const DoWeHaveTheTool = new FunctionalTool({
    function: {

        name: "DoWeHaveTheTool",
        description: `Utiliza esta herramienta para saber si tenemos una herramienta que pueda realizar la tarea. 
        o si necesitamos crear una nueva herramienta para realizar la tarea. y a cual manager le corresponde la tarea.`,
        parameters: {
            type: "object",
            properties: {
                task: { type: "object", description: "Tarea a realizar" }
            },
            required: ["task"]
        }
    },
    type: "function"
},
    () => {
        return "Hello World";
    });

