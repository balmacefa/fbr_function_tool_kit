import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Prisma, PrismaClient } from "@prisma/client";
import { Remarkable } from 'remarkable';
import { z } from 'zod';
import { FunctionalTool } from "../FunctionalTool";

extendZodWithOpenApi(z);

const prisma = new PrismaClient()

var md = new Remarkable();

type GoalCreateBody = Prisma.Args<typeof prisma.goal, 'create'>['data']




const DoCreateGoalTool = new FunctionalTool({
    type: "function",
    function: {
        name: "DoCreateGoalTool",
        description: "Crea un nuevo objetivo",
        parameters: {
            type: "object",
            properties: {
                goal: { type: "object", description: "Objetivo a crear" }
            },
            required: ["goal"]
        }
    }
}, () => { });