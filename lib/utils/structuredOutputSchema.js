import { z } from "zod";

export const structuredOutputSchema = z.object({
  summary: z.string().min(1),
  swot: z.object({
    strengths: z.array(z.string()).min(1),
    weaknesses: z.array(z.string()).min(1),
    opportunities: z.array(z.string()).min(1),
    threats: z.array(z.string()).min(1),
  }),
  conclusion: z.string().min(1),
  monetization: z.array(z.string()).min(1),
  actionableInsights: z.array(z.string()).min(1),
  pitchDeckOutline: z.array(z.string()).min(1),
  competitors: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).min(1),
  marketTrends: z.object({
    trends: z.array(z.object({
        title: z.string(),
        description: z.string(),
    })).min(1),
    trendSummary: z.string().min(1),
  }),
  score: z.number().min(0).max(100),
  pieChartData: z.object({
    marketPotential: z.number().min(0).max(100).default(0),
    feasibility: z.number().min(0).max(100).default(0),
    competition: z.number().min(0).max(100).default(0),
    monetization: z.number().min(0).max(100).default(0),
    innovation: z.number().min(0).max(100).default(0),
  }),
  warnings: z.array(z.string()).optional(),
});