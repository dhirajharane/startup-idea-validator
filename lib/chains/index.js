import { runIdeaSummaryChain } from "./ideaSummaryChain";
import { runSwotChain } from "./swotChain";
import { runMonetizationChain } from "./monetizationChain";
import { runActionableInsightsChain } from "./actionableInsightsChain";
import { runConclusionChain } from "./conclusionChain";
import { runPitchDeckChain } from "./pitchDeckChain";
import { runScoreChain } from "./scoreChain";
import { searchCompetitors } from "../tools/searchCompetitors";
import { marketTrendScraper } from "../tools/marketTrendScraper";
import { formatPieChartData } from "../utils/formatPieChartData";

export async function runIdeaValidatorChains(startupIdea) {
  const warnings = [];

  try {
    const [
      summary,
      swot,
      monetization,
      actionableInsights,
      conclusion,
      pitchDeckOutline,
      competitorsResult,
      marketTrendsResult,
    ] = await Promise.all([
      runIdeaSummaryChain(startupIdea).catch((e) => {
        warnings.push(`Failed to generate summary: ${e.message}`);
        return "";
      }),
      runSwotChain(startupIdea).catch((e) => {
        warnings.push(`Failed to generate SWOT analysis: ${e.message}`);
        return { strengths: [], weaknesses: [], opportunities: [], threats: [] };
      }),
      runMonetizationChain(startupIdea).catch((e) => {
        warnings.push(`Failed to generate monetization strategies: ${e.message}`);
        return [];
      }),
      runActionableInsightsChain(startupIdea).catch((e) => {
        warnings.push(`Failed to generate actionable insights: ${e.message}`);
        return [];
      }),
      runConclusionChain(startupIdea).catch((e) => {
        warnings.push(`Failed to generate conclusion: ${e.message}`);
        return "";
      }),
      runPitchDeckChain(startupIdea).catch((e) => {
        warnings.push(`Failed to generate pitch deck outline: ${e.message}`);
        return [];
      }),
      searchCompetitors(startupIdea).catch((e) => {
        warnings.push(`Failed to find competitors: ${e.message}`);
        return { competitors: [] };
      }),
      marketTrendScraper(startupIdea).catch((e) => {
        warnings.push(`Failed to scrape market trends: ${e.message}`);
        return { trends: [], trendSummary: "" };
      }),
    ]);

    const analysisForScoring = `
      Startup Idea: ${startupIdea}
      Summary: ${summary}
      SWOT: ${JSON.stringify(swot)}
      Monetization: ${monetization.join(", ")}
      Actionable Insights: ${actionableInsights.join(", ")}
      Competitors: ${competitorsResult.map(c => c.name).join(", ")}
      Market Trends: ${marketTrendsResult.trendSummary}
    `;

    const score = await runScoreChain(analysisForScoring).catch((e) => {
      warnings.push(`Failed to generate score: ${e.message}`);
      return 50; 
    });

    const pieChartData = formatPieChartData({
      swot,
      monetization,
      actionableInsights,
      competitors: competitorsResult,
      marketTrends: marketTrendsResult.trends,
    });

    return {
      summary,
      swot,
      monetization,
      actionableInsights,
      conclusion,
      pitchDeckOutline,
      competitors: competitorsResult,
      marketTrends: marketTrendsResult,
      score,
      pieChartData,
      warnings,
    };
  } catch (error) {
    console.error("An error occurred during the idea validation process:", error);
    return null;
  }
}