import { ChatGroq } from "@langchain/groq"
import { PromptTemplate } from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"
import { extractAndParseJson } from '../utils.js'

const MODEL_CONFIG = {
  temperature: 0.3,
  model: "llama-3.1-8b-instant",
}

const outputSchema = z.object({
  slides: z.array(z.string()).min(8).max(10),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

const promptTemplate = new PromptTemplate({
  template: `You are a world-class startup pitch coach.
Generate 8 to 10 concise and compelling slide titles for a pitch deck based on the startup idea below.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
})

const model = new ChatGroq(MODEL_CONFIG)

export async function runPitchDeckChain(startupIdea) {
  try {
    const prompt = await promptTemplate.format({ startupIdea })
    const result = await model.invoke(prompt)
    const parsed = extractAndParseJson(result)
    return parsed?.slides ?? []
  } catch (error) {
    console.error("Error running Pitch Deck Chain:", error)
    return []
  }
}
