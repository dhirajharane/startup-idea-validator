import { ChatGroq } from "@langchain/groq"
import { PromptTemplate } from "@langchain/core/prompts"
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { z } from "zod"
import { extractAndParseJson } from '../utils.js'

const MODEL_CONFIG = {
  temperature: 0.4,
  model: "llama-3.1-8b-instant",
}

const DEFAULT_SWOT_OUTPUT = {
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
}

const outputSchema = z.object({
  strengths: z.array(z.string()).min(2).max(4),
  weaknesses: z.array(z.string()).min(2).max(4),
  opportunities: z.array(z.string()).min(2).max(4),
  threats: z.array(z.string()).min(2).max(4),
})

const outputParser = StructuredOutputParser.fromZodSchema(outputSchema)

const promptTemplate = new PromptTemplate({
  template: `You are a seasoned business analyst AI known for critical and objective insights.
Your task is to conduct a concise SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the provided startup idea.
For each of the four categories, provide 2-4 sharp, factual bullet points.

{format_instructions}

Startup Idea: {startupIdea}`,
  inputVariables: ["startupIdea"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
})

const model = new ChatGroq(MODEL_CONFIG)

export async function runSwotChain(startupIdea) {
  try {
    const prompt = await promptTemplate.format({ startupIdea })
    const result = await model.invoke(prompt)
    const parsed = extractAndParseJson(result)
    return parsed ?? DEFAULT_SWOT_OUTPUT
  } catch (error) {
    console.error("Error running SWOT Chain:", error)
    return DEFAULT_SWOT_OUTPUT
  }
}
