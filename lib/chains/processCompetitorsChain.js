import { z } from "zod";
import { getGroqModel } from "../config/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { extractAndParseJson } from "../utils/extractAndParseJson";

const outputSchema = z.object({
  competitors: z.array(
    z.object({
      name: z.string().describe("The name of the competitor company."),
      description: z.string().describe("A one-line description of what the company does."),
    })
  ).length(4),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are an analyst. From the following search result snippets, extract exactly 4 competitor companies and provide a clean, one-sentence description for each. Ignore any results that are just articles or lists.
  Output ONLY valid JSON that matches the schema, no markdown, no commentary, no schema text.

{format_instructions}

Search Results:
{searchResults}`,
  inputVariables: ["searchResults"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

export async function runProcessCompetitorsChain(searchResults) {
  const model = getGroqModel();
  const chain = promptTemplate.pipe(model);
  const result = await chain.invoke({ searchResults });
  const parsed = extractAndParseJson(result.content, { competitors: [] });
  const validation = outputSchema.safeParse(parsed);

  if (!validation.success) {
    return [];
  }
  return validation.data.competitors;
}