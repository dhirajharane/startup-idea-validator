import { z } from "zod";
import { getGroqModel } from "../config/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { extractAndParseJson } from "../utils/extractAndParseJson";

const outputSchema = z.object({
  score: z.number().min(0).max(100),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are a seasoned venture capitalist. Based on the following comprehensive analysis, provide an overall validation score for the startup idea from 0 (very poor) to 100 (highly promising). Consider all factors including market potential, feasibility, competition, monetization, and innovation. A truly groundbreaking idea with a solid plan should score above 85. A decent idea with potential but some flaws might score around 60-75. A weak idea should score below 40.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Comprehensive Analysis:
{analysis}`,
  inputVariables: ["analysis"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runScoreChain(analysis) {
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ analysis });
  const parsed = extractAndParseJson(result.content, { score: 50 });
  const validation = outputSchema.safeParse(parsed);

  if (!validation.success) {
    return 50;
  }
  return validation.data.score;
}