import { z } from "zod";
import { getGroqModel } from "../config/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { extractAndParseJson } from "../utils/extractAndParseJson";

const outputSchema = z.object({
  trends: z.array(
    z.object({
      title: z.string().describe("A concise title for the market trend."),
      description: z.string().describe("A one-sentence summary of the trend."),
    })
  ).length(5),
  trendSummary: z.string().describe("A brief, overall summary of the market trends."),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are a market analyst. From the following search result snippets, synthesize exactly 5 key market trends into concise titles and one-sentence descriptions. Then, provide a short overall summary of the trends.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Search Results:
{searchResults}`,
  inputVariables: ["searchResults"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runProcessMarketTrendsChain(searchResults) {
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ searchResults });
  const fallback = { trends: [], trendSummary: "" };
  const parsed = extractAndParseJson(result.content, fallback);
  const validation = outputSchema.safeParse(parsed);

  if (!validation.success) {
    return fallback;
  }
  return validation.data;
}