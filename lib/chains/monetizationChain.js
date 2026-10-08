import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { runStructuredChain } from "../utils/runStructuredChain";

const outputSchema = z.object({
  strategies: z.array(z.string()).min(2).max(4),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are a product strategist. Suggest monetization strategies for the startup idea.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runMonetizationChain(startupIdea) {
  const result = await runStructuredChain({ name: "monetization", promptTemplate, outputSchema, input: { startupIdea } });
  return result.strategies;
}