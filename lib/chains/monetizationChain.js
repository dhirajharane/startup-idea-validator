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
  strategies: z.array(z.string()).min(2).max(4),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

const promptTemplate = new PromptTemplate({
  template: `You are an experienced product strategist.
Suggest 2 to 4 concise and practical monetization strategies for the startup idea below.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
})

const model = new ChatGroq(MODEL_CONFIG)

export async function runMonetizationChain(startupIdea) {
  try {
    const prompt = await promptTemplate.format({ startupIdea })
    const result = await model.invoke(prompt)

    const parsed = extractAndParseJson(result)
    return parsed?.strategies ?? []
  } catch (error) {
    console.error("Error running Monetization Chain:", error)
    return []
  }
}
