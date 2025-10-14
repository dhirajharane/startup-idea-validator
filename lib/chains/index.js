import { runIdeaSummaryChain } from "./ideaSummaryChain.js";
import { runSwotChain } from "./swotChain.js";
import { runMonetizationChain } from "./monetizationChain.js";
import { runActionableInsightsChain } from "./actionableInsightsChain.js";
import { runConclusionChain } from "./conclusionChain.js";
import { runPitchDeckChain } from "./pitchDeckChain.js";
import { runScoreChain } from "./scoreChain.js";
import { searchCompetitors } from "../tools/searchCompetitors.js";
import { marketTrendScraper } from "../tools/marketTrendScraper.js";
import { formatPieChartData } from "../utils/formatPieChartData.js";

const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON string:", jsonString, error);
    return fallback;
  }
};

export async function runIdeaValidatorChains(startupIdea) {
  try {
    // --- Step 1: Run all chains/tools in parallel ---
    const [
      summary,
      swot,
      monetization,
      actionableInsights,
      conclusion,
      pitchDeckOutline,
      competitorsJson,
      marketTrendsJson,
    ] = await Promise.all([
      runIdeaSummaryChain(startupIdea),
      runSwotChain(startupIdea),
      runMonetizationChain(startupIdea),
      runActionableInsightsChain(startupIdea),
      runConclusionChain(startupIdea),
      runPitchDeckChain(startupIdea),
      searchCompetitors.invoke(startupIdea),
      marketTrendScraper.invoke(startupIdea),
    ]);

    // --- Step 2: Parse external tool outputs safely ---
    const competitors = safeJsonParse(competitorsJson, { competitors: [] });
    const marketTrends = safeJsonParse(marketTrendsJson, { trends: [] });

    // --- Step 3: Prepare analysis for scoring ---
    const analysisForScoring = `
      Strengths: ${swot.strengths?.join(", ") ?? ""}
      Weaknesses: ${swot.weaknesses?.join(", ") ?? ""}
      Monetization Strategies: ${monetization?.join(", ") ?? ""}
      Actionable Insights: ${actionableInsights?.join(", ") ?? ""}
    `;
    const score = await runScoreChain(analysisForScoring);

    // --- Step 4: Build a detailed report for quantitative insights ---
    const reportString = `
      Original Startup Idea: ${startupIdea}

      Summary: ${summary}
      Conclusion: ${conclusion}
      Strengths: ${swot.strengths?.join(", ") ?? ""}
      Weaknesses: ${swot.weaknesses?.join(", ") ?? ""}
      Opportunities: ${swot.opportunities?.join(", ") ?? ""}
      Threats: ${swot.threats?.join(", ") ?? ""}
      Monetization Strategies: ${monetization?.join(", ") ?? ""}
      Actionable Insights: ${actionableInsights?.join(", ") ?? ""}
    `;

    // --- Step 5: Generate quantitative data ---
    const pieChartData = await formatPieChartData(reportString);

    // --- Step 6: Return the final structured report ---
    return {
      summary,
      swot,
      monetization,
      actionableInsights,
      conclusion,
      pitchDeckOutline,
      competitors: competitors.competitors ?? [],
      marketTrends: marketTrends.trends ?? [],
      score,
      pieChartData,
    };
  } catch (error) {
    console.error("An error occurred during the idea validation process:", error);
    return null;
  }
}
