import { z } from "zod";

export const structuredOutputSchema = z.object({
  summary: z.string().default(""),
  swot: z.object({
    strengths: z.array(z.string()).default([]),
    weaknesses: z.array(z.string()).default([]),
    opportunities: z.array(z.string()).default([]),
    threats: z.array(z.string()).default([]),
  }),
  conclusion: z.string().default(""),
  monetization: z.array(z.string()).default([]),
  actionableInsights: z.array(z.string()).default([]),
  pitchDeckOutline: z.array(z.string()).default([]),
  competitors: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).default([]),
  marketTrends: z.object({
    trends: z.array(z.object({
        title: z.string(),
        description: z.string(),
    })).default([]),
    trendSummary: z.string().default(""),
  }),
  score: z.number().min(0).max(100).default(50),
  pieChartData: z.object({
    marketPotential: z.number().min(0).max(100).default(0),
    feasibility: z.number().min(0).max(100).default(0),
    competition: z.number().min(0).max(100).default(0),
    monetization: z.number().min(0).max(100).default(0),
    innovation: z.number().min(0).max(100).default(0),
  }),
  warnings: z.array(z.string()).optional(),
});