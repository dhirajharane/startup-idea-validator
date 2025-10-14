import { ChatGroq } from "@langchain/groq"
import { PromptTemplate } from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"
import { extractAndParseJson } from '../utils.js'

const MODEL_CONFIG = {
  temperature: 0.4,
  model: "llama-3.1-8b-instant",
}

const outputSchema = z.object({
  suggestions: z
    .array(z.string())
    .min(3, "Must provide at least 3 suggestions.")
    .max(5, "Should not provide more than 5 suggestions."),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

const promptTemplate = new PromptTemplate({
  template: `You are an expert product advisor.
Give 3 to 5 actionable ways to make the startup idea more feasible or competitive.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
})

const model = new ChatGroq(MODEL_CONFIG)

export async function runActionableInsightsChain(startupIdea) {
  try {
    const prompt = await promptTemplate.format({ startupIdea })
    const result = await model.invoke(prompt)

    // Use extractAndParseJson to safely get the structured suggestions
    const parsed = extractAndParseJson(result)
    return parsed?.suggestions ?? []
  } catch (error) {
    console.error("Error running Actionable Insights Chain:", error)
    return []
  }
}
