import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { runStructuredChain } from "../utils/runStructuredChain";

const outputSchema = z.object({
  conclusion: z.string().min(100).max(600),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are a startup analyst. Write a 2-4 line conclusion for the startup idea below. Address its feasibility, market potential, and if it is worth pursuing.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runConclusionChain(startupIdea) {
  const result = await runStructuredChain({ name: "conclusion", promptTemplate, outputSchema, input: { startupIdea } });
  return result.conclusion;
}