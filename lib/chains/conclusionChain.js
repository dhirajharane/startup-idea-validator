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
  conclusion: z
    .string()
    .min(100, "Conclusion must be at least 100 characters.")
    .max(600, "Conclusion must not exceed 600 characters."),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

const promptTemplate = new PromptTemplate({
  template: `You are a startup analyst.
Write a 2-4 line conclusion for the startup idea below.
Address its feasibility, market potential, and if it is worth pursuing.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
})

const model = new ChatGroq(MODEL_CONFIG)

export async function runConclusionChain(startupIdea) {
  try {
    const prompt = await promptTemplate.format({ startupIdea })
    const result = await model.invoke(prompt)

    // Parse JSON safely
    const parsed = extractAndParseJson(result)
    return parsed?.conclusion ?? ""
  } catch (error) {
    console.error("Error running Conclusion Chain:", error)
    return ""
  }
}
