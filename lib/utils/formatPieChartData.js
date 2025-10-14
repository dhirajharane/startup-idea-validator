import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// --- Configuration & Constants ---
const MODEL_CONFIG = {
  // A lower temperature is better for precise, numeric tasks.
  temperature: 0.1,
  model: "llama-3.1-8b-instant",
};

// A safe, default return value for error cases.
const DEFAULT_PIE_CHART_DATA = {
  marketPotential: 20,
  feasibility: 20,
  competition: 20,
  monetization: 20,
  innovation: 20,
};

// --- 1. Define Schema with Sum Validation ---
// The schema now programmatically validates that the sum of all scores is 100.
const outputSchema = z.object({
  marketPotential: z.number().min(0).max(100).describe("Percentage score for market size and demand."),
  feasibility: z.number().min(0).max(100).describe("Percentage score for technical and operational feasibility."),
  competition: z.number().min(0).max(100).describe("Percentage score based on the competitive landscape."),
  monetization: z.number().min(0).max(100).describe("Percentage score for the viability of revenue models."),
  innovation: z.number().min(0).max(100).describe("Percentage score for the uniqueness of the idea."),
}).refine((data) => {
  const sum = Object.values(data).reduce((acc, value) => acc + value, 0);
  // Allow for minor floating-point inaccuracies from the LLM.
  return Math.abs(sum - 100) < 0.01;
}, {
  message: "The sum of all five scores must be exactly 100.",
});

// --- 2. Create Parser, Prompt, Model, and Chain (Initialized once) ---
const outputParser = StructuredOutputParser.fromZodSchema(outputSchema);

const promptTemplate = new PromptTemplate({
  template: `You are a quantitative business analyst. Your task is to analyze the provided startup report and break down its potential into five key areas.
Assign a percentage score to each of the five categories below based on the report's content.
The total sum of all five scores must equal exactly 100.

{format_instructions}

Startup Report:
{report}
`,
  inputVariables: ["report"],
  partialVariables: {
    format_instructions: outputParser.getFormatInstructions(),
  },
});

const model = new ChatGroq(MODEL_CONFIG);
const chartDataChain = promptTemplate.pipe(model).pipe(outputParser);

// --- 3. Export Runner Function ---
/**
 * @description Analyzes a report string to generate structured data for a pie chart.
 * @param {string} report - The full startup validation report as a single string.
 * @returns {Promise<typeof DEFAULT_PIE_CHART_DATA>} A promise that resolves to an object with 5 scores summing to 100.
 */
export async function formatPieChartData(report) {
  try {
    const result = await chartDataChain.invoke({ report });
    return result;
  } catch (error) {
    console.error("Error formatting pie chart data, returning default values:", error);
    // Return the default balanced object on failure.
    return DEFAULT_PIE_CHART_DATA;
  }
}