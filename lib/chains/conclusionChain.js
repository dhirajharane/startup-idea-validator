import { z } from "zod";
import { getGroqModel } from "../config/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { extractAndParseJson } from "../utils/extractAndParseJson";

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
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ startupIdea });
  const parsed = extractAndParseJson(result.content, { conclusion: "" });
  const validation = outputSchema.safeParse(parsed);

  if (!validation.success) {
    return "A conclusion could not be generated for this idea.";
  }
  return validation.data.conclusion;
}