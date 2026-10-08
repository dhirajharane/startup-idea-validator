import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { runStructuredChain } from "../utils/runStructuredChain";

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
  const result = await runStructuredChain({ name: "score", promptTemplate, outputSchema, input: { analysis } });
  return result.score;
}