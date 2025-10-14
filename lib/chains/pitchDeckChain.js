import { z } from "zod";
import { getGroqModel } from "../config/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { extractAndParseJson } from "../utils/extractAndParseJson";

const outputSchema = z.object({
  slides: z.array(z.string()).min(8).max(10),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are a world-class startup pitch coach. Generate 8 to 10 concise and compelling slide titles for a pitch deck based on the startup idea below.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runPitchDeckChain(startupIdea) {
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ startupIdea });
  const parsed = extractAndParseJson(result.content, { slides: [] });
  const validation = outputSchema.safeParse(parsed);

  if (!validation.success) {
    return [];
  }
  return validation.data.slides;
}