import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { extractAndParseJson } from '../utils.js';

const MODEL_CONFIG = {
  temperature: 0.3,
  model: "llama-3.1-8b-instant",
};

const outputSchema = z.object({
  summary: z.string().min(200).max(500),
});

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `
You are an AI startup analyst. Provide a concise and clear summary of the startup idea below.
**Output ONLY valid JSON matching the schema, do not include explanations, markdown, or extra text.**

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

const model = new ChatGroq(MODEL_CONFIG);
const ideaSummaryChain = promptTemplate.pipe(model).pipe(outputParser);

export async function runIdeaSummaryChain(startupIdea) {
  try {
    const result = await ideaSummaryChain.invoke({ startupIdea });
    return extractAndParseJson(result)?.summary ?? "";
  } catch (error) {
    console.error("Error running Idea Summary Chain:", error);
    return "";
  }
}
