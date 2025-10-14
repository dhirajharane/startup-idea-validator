import { z } from 'zod';

/**
 * Defines the final, consolidated structure for a startup idea validation report.
 * Aggregates outputs from all chains into a single, type-safe object.
 */
export const structuredOutputSchema = z.object({
  // --- Core Analysis ---
  summary: z.string()
    .min(1, "Summary cannot be empty.")
    .describe("A concise 3-5 line executive summary of the startup idea."),

  swot: z.object({
    strengths: z.array(z.string()).min(2).max(4).default([])
      .describe("An array of 2-4 key internal strengths."),
    weaknesses: z.array(z.string()).min(2).max(4).default([])
      .describe("An array of 2-4 key internal weaknesses."),
    opportunities: z.array(z.string()).min(2).max(4).default([])
      .describe("An array of 2-4 key external market opportunities."),
    threats: z.array(z.string()).min(2).max(4).default([])
      .describe("An array of 2-4 key external threats."),
  }).describe("A comprehensive SWOT analysis of the idea."),

  conclusion: z.string()
    .min(1, "Conclusion cannot be empty.")
    .describe("A final 2-4 line verdict on the idea's overall potential and feasibility."),

  // --- Strategic Outlines ---
  monetization: z.array(z.string()).min(2).max(4).default([])
    .describe("An array of 2-4 practical monetization strategies."),

  actionableInsights: z.array(z.string()).min(3).max(5).default([])
    .describe("An array of 3-5 actionable suggestions for improvement."),

  pitchDeckOutline: z.array(z.string()).min(8).max(10).default([])
    .describe("An array of 8-10 essential slide titles for an investor pitch deck."),

  // --- Market & Competitive Landscape ---
  competitors: z.array(
    z.object({
      name: z.string().describe("The name of the competitor company."),
      description: z.string().describe("A one-line description of the competitor."),
      region: z.string().optional().describe("The primary region or headquarters of the competitor."),
      funding: z.string().optional().describe("The total funding raised by the competitor (e.g., '$5M')."),
    })
  ).max(4).default([])
    .describe("A list of up to 4 primary competitors."),

  marketTrends: z.object({
    trendSummary: z.string().default("").describe("A summary of current market trends."),
    keywordVolume: z.string().optional().describe("Estimated monthly search volume for related keywords."),
    growthRate: z.string().optional().describe("The projected market growth rate (e.g., '15% CAGR')."),
  }).default({})
    .describe("An overview of relevant market trends, size, and growth."),

  // --- Quantitative Scoring ---
  score: z.number().min(0).max(100).default(50)
    .describe("Overall validation score from 0 to 100, where 100 is highly promising."),

  pieChartData: z.object({
    marketPotential: z.number().min(0).max(100).default(0).describe("Score (0-100) for market size and demand."),
    feasibility: z.number().min(0).max(100).default(0).describe("Score (0-100) for technical and operational feasibility."),
    competition: z.number().min(0).max(100).default(0).describe("Score (0-100) based on the competitive landscape."),
    monetization: z.number().min(0).max(100).default(0).describe("Score (0-100) for the viability of revenue models."),
    innovation: z.number().min(0).max(100).default(0).describe("Score (0-100) for the uniqueness of the idea."),
  }).default({})
    .describe("Data points for a chart, each scored out of 100."),
});
