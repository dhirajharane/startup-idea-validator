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

function asArray(value, propertyName) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object" && Array.isArray(value[propertyName])) {
    return value[propertyName];
  }

  return [];
}

function asStringArray(value, propertyName) {
  return asArray(value, propertyName).filter((item) => typeof item === "string");
}

function asCompetitorArray(value) {
  return asArray(value, "competitors").filter(
    (competitor) => competitor && typeof competitor === "object"
      && typeof competitor.name === "string"
      && typeof competitor.description === "string"
  );
}

function asTrendArray(value) {
  return asArray(value, "trends").filter(
    (trend) => trend && typeof trend === "object"
      && typeof trend.title === "string"
      && typeof trend.description === "string"
  );
}

async function runNamedChain(name, chain) {
  try {
    return await chain();
  } catch (error) {
    console.error(`[report] ${name} failed:`, error);
    throw new Error(`${name} failed: ${error.message}`, { cause: error });
  }
}

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
      runNamedChain("summary", () => runIdeaSummaryChain(startupIdea)),
      runNamedChain("SWOT", () => runSwotChain(startupIdea)),
      runNamedChain("monetization", () => runMonetizationChain(startupIdea)),
      runNamedChain("actionable insights", () => runActionableInsightsChain(startupIdea)),
      runNamedChain("conclusion", () => runConclusionChain(startupIdea)),
      runNamedChain("pitch deck", () => runPitchDeckChain(startupIdea)),
      runNamedChain("competitors", () => searchCompetitors(startupIdea)),
      runNamedChain("market trends", () => marketTrendScraper(startupIdea)),
    ]);

    const safeMonetization = asStringArray(monetization, "strategies");
    const safeActionableInsights = asStringArray(actionableInsights, "insights");
    const safePitchDeckOutline = asStringArray(pitchDeckOutline, "outline");
    const safeCompetitors = asCompetitorArray(competitorsResult);
    const safeSwot = swot && typeof swot === "object"
      ? {
          strengths: asStringArray(swot.strengths),
          weaknesses: asStringArray(swot.weaknesses),
          opportunities: asStringArray(swot.opportunities),
          threats: asStringArray(swot.threats),
        }
      : { strengths: [], weaknesses: [], opportunities: [], threats: [] };
    const safeMarketTrends = marketTrendsResult && typeof marketTrendsResult === "object"
      ? {
          trends: marketTrendsResult.trends,
          trendSummary: typeof marketTrendsResult.trendSummary === "string"
            ? marketTrendsResult.trendSummary
            : "",
        }
      : { trends: [], trendSummary: "" };
    const safeTrends = asTrendArray(safeMarketTrends.trends);

    const analysisForScoring = `
      Startup Idea: ${startupIdea}
      Summary: ${summary}
      SWOT: ${JSON.stringify(safeSwot)}
      Monetization: ${safeMonetization.join(", ")}
      Actionable Insights: ${safeActionableInsights.join(", ")}
      Competitors: ${safeCompetitors.map((competitor) => competitor?.name).filter(Boolean).join(", ")}
      Market Trends: ${safeMarketTrends.trendSummary || ""}
    `;

    const score = await runNamedChain("score", () => runScoreChain(analysisForScoring));

    const pieChartData = formatPieChartData({
      swot: safeSwot,
      monetization: safeMonetization,
      actionableInsights: safeActionableInsights,
      competitors: safeCompetitors,
      marketTrends: safeTrends,
    });

    return {
      summary,
      swot,
      monetization: safeMonetization,
      actionableInsights: safeActionableInsights,
      conclusion,
      pitchDeckOutline: safePitchDeckOutline,
      competitors: safeCompetitors,
      marketTrends: { ...safeMarketTrends, trends: safeTrends },
      score,
      pieChartData,
      warnings,
    };
  } catch (error) {
    console.error("An error occurred during the idea validation process:", error);
    return null;
  }
}