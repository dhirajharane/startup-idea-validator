import { z } from "zod";
import { getGroqModel } from "../config/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { extractAndParseJson } from "../utils/extractAndParseJson";

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
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ startupIdea });
  const parsed = extractAndParseJson(result.content, { strategies: [] });
  const validation = outputSchema.safeParse(parsed);

  if (!validation.success) {
    return [];
  }
  return validation.data.strategies;
}