import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { runStructuredChain } from "../utils/runStructuredChain";

const outputSchema = z.object({
  suggestions: z.array(z.string()).min(3).max(5),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are a product advisor. Give actionable ways to improve the startup idea.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runActionableInsightsChain(startupIdea) {
  const result = await runStructuredChain({ name: "actionable insights", promptTemplate, outputSchema, input: { startupIdea } });
  return result.suggestions;
}