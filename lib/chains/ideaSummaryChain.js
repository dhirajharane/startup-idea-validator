import { z } from "zod";
import { getGroqModel } from "../config/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { extractAndParseJson } from "../utils/extractAndParseJson";

const outputSchema = z.object({
  summary: z.string().min(100).max(600),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are an AI startup analyst. Provide a concise summary of the startup idea below.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runIdeaSummaryChain(startupIdea) {
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ startupIdea });
  const parsed = extractAndParseJson(result.content);
  const validation = outputSchema.safeParse(parsed);

  if (!validation.success) {
    throw new Error(`Summary response failed validation: ${validation.error.message}`);
  }
  return validation.data.summary;
}