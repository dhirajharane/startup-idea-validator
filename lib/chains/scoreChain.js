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
  score: z.number().min(0).max(100),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

const promptTemplate = new PromptTemplate({
  template: `You are a startup incubator analyst. Assign an overall validation score (0-100) to a startup idea based on the analysis below. Consider strengths vs. weaknesses, monetization viability, and quality of insights.

{format_instructions}

ANALYSIS:
{analysis}`,
  inputVariables: ["analysis"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
})

const model = new ChatGroq(MODEL_CONFIG)

export async function runScoreChain(analysis) {
  try {
    const prompt = await promptTemplate.format({ analysis })
    const result = await model.invoke(prompt)
    const parsed = extractAndParseJson(result)
    return parsed?.score ?? null
  } catch (error) {
    console.error("Error running Score Chain:", error)
    return null
  }
}
