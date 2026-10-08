import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { runStructuredChain } from "../utils/runStructuredChain";

const outputSchema = z.object({
  trends: z.array(
    z.object({
      title: z.string().describe("A concise title for the market trend."),
      description: z.string().describe("A one-sentence summary of the trend."),
    })
  ).length(5),
  trendSummary: z.string().min(1).describe("A brief, overall summary of the market trends."),
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

export async function runProcessMarketTrendsChain(searchResults, startupIdea) {
  return runStructuredChain({
    name: "market trends",
    promptTemplate,
    outputSchema,
    input: { searchResults: `${searchResults}\n\nStartup idea being analyzed: ${startupIdea}` },
  });
}