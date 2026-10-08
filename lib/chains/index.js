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

function fallbackSummary(startupIdea) {
  return `This report evaluates ${startupIdea} as a focused startup opportunity. The idea should be tested with a narrow customer segment, a measurable problem, and a simple first version before substantial investment. Market demand, willingness to pay, and repeat usage are the most important assumptions to validate next.`;
}

function fallbackConclusion(startupIdea) {
  return `${startupIdea} is worth validating through customer interviews and a small market test before a full build. Its feasibility depends on reaching a clearly defined audience, proving a differentiated outcome, and establishing a repeatable acquisition and monetization path. The next decision should be based on evidence from real users.`;
}

function fallbackSwot(startupIdea) {
  return {
    strengths: [`The idea addresses a potentially concrete customer problem in the ${startupIdea} space.`, "A focused initial product can be tested without building every planned capability."],
    weaknesses: ["Customer demand and willingness to pay still need direct validation.", "Early operations may depend heavily on the founding team."],
    opportunities: ["A narrowly defined customer segment could provide an efficient beachhead.", "Partnerships and workflow integrations could expand distribution."],
    threats: ["Existing alternatives may already have customer trust and distribution.", "A competitor could copy a useful feature before differentiation is established."],
  };
}

function fallbackMonetization(startupIdea) {
  return [`Charge the primary ${startupIdea} customer a recurring subscription for the core outcome.`, "Offer a higher-priced plan with automation, collaboration, or premium support."];
}

function fallbackInsights(startupIdea) {
  return [
    `Interview at least ten likely ${startupIdea} customers and document their current workaround.`,
    "Test a focused landing page or concierge pilot with a measurable conversion goal.",
    "Measure retention, repeat usage, and willingness to pay before expanding the product scope.",
  ];
}

function fallbackPitchDeck(startupIdea) {
  return ["The customer problem", "Who experiences it", "Current alternatives", `The ${startupIdea} solution`, "Why now", "Market opportunity", "Business model", "Go-to-market plan"];
}

function fallbackCompetitors(startupIdea) {
  return [
    { name: `${startupIdea} alternative`, description: `Established products serving customers with a similar ${startupIdea} use case.` },
    { name: `${startupIdea} specialist`, description: `Focused providers competing through a narrower solution for the ${startupIdea} market.` },
    { name: `${startupIdea} platform`, description: `Broader platforms that can overlap with the target customers and workflow.` },
    { name: `${startupIdea} in-house solution`, description: `The internal or manual approach customers may use instead of this startup.` },
  ];
}

function fallbackMarketTrends(startupIdea) {
  return {
    trends: [
      { title: "Demand for measurable outcomes", description: `Customers evaluating ${startupIdea} increasingly expect clear proof of time, cost, or revenue impact.` },
      { title: "Workflow automation", description: `Teams are adopting automation to reduce repetitive work connected to ${startupIdea}.` },
      { title: "Integrated experiences", description: `Products connected to existing tools are easier for ${startupIdea} customers to adopt.` },
      { title: "Trust and privacy", description: `Transparent handling of data and dependable results are becoming important buying criteria.` },
      { title: "Focused vertical solutions", description: `Specialized products can win when they understand a particular ${startupIdea} customer segment deeply.` },
    ],
    trendSummary: `The ${startupIdea} opportunity is shaped by demand for measurable outcomes, efficient workflows, trusted data handling, and focused solutions that fit existing tools.`,
  };
}

async function runNamedChain(name, chain, fallback, warnings) {
  try {
    return await chain();
  } catch (error) {
    console.error(`[report] ${name} failed:`, error);
    if (!fallback) throw new Error(`${name} failed: ${error.message}`, { cause: error });
    warnings.push(`${name} used a local fallback after two invalid AI responses: ${error.message}`);
    return fallback();
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
      runNamedChain("summary", () => runIdeaSummaryChain(startupIdea), () => fallbackSummary(startupIdea), warnings),
      runNamedChain("SWOT", () => runSwotChain(startupIdea), () => fallbackSwot(startupIdea), warnings),
      runNamedChain("monetization", () => runMonetizationChain(startupIdea), () => fallbackMonetization(startupIdea), warnings),
      runNamedChain("actionable insights", () => runActionableInsightsChain(startupIdea), () => fallbackInsights(startupIdea), warnings),
      runNamedChain("conclusion", () => runConclusionChain(startupIdea), () => fallbackConclusion(startupIdea), warnings),
      runNamedChain("pitch deck", () => runPitchDeckChain(startupIdea), () => fallbackPitchDeck(startupIdea), warnings),
      runNamedChain("competitors", () => searchCompetitors(startupIdea), () => fallbackCompetitors(startupIdea), warnings),
      runNamedChain("market trends", () => marketTrendScraper(startupIdea), () => fallbackMarketTrends(startupIdea), warnings),
    ]);

    const monetizationValues = asStringArray(monetization, "strategies");
    const actionableInsightValues = asStringArray(actionableInsights, "insights");
    const pitchDeckValues = asStringArray(pitchDeckOutline, "outline");
    const competitorValues = asCompetitorArray(competitorsResult);
    const swotValues = swot && typeof swot === "object"
      ? {
          strengths: asStringArray(swot.strengths),
          weaknesses: asStringArray(swot.weaknesses),
          opportunities: asStringArray(swot.opportunities),
          threats: asStringArray(swot.threats),
        }
      : null;
    const marketTrendValues = marketTrendsResult && typeof marketTrendsResult === "object"
      ? {
          trends: marketTrendsResult.trends,
          trendSummary: typeof marketTrendsResult.trendSummary === "string"
            ? marketTrendsResult.trendSummary
            : null,
        }
      : null;
    const safeMonetization = monetizationValues.length ? monetizationValues : fallbackMonetization(startupIdea);
    const safeActionableInsights = actionableInsightValues.length ? actionableInsightValues : fallbackInsights(startupIdea);
    const safePitchDeckOutline = pitchDeckValues.length ? pitchDeckValues : fallbackPitchDeck(startupIdea);
    const safeCompetitors = competitorValues.length ? competitorValues : fallbackCompetitors(startupIdea);
    const safeSwot = swotValues && Object.values(swotValues).every((items) => items.length)
      ? swotValues
      : fallbackSwot(startupIdea);
    const normalizedTrends = marketTrendValues ? asTrendArray(marketTrendValues.trends) : [];
    const safeMarketTrends = marketTrendValues && normalizedTrends.length && marketTrendValues.trendSummary
      ? { ...marketTrendValues, trends: normalizedTrends }
      : fallbackMarketTrends(startupIdea);
    const safeTrends = safeMarketTrends.trends;

    const analysisForScoring = `
      Startup Idea: ${startupIdea}
      Summary: ${summary}
      SWOT: ${JSON.stringify(safeSwot)}
      Monetization: ${safeMonetization.join(", ")}
      Actionable Insights: ${safeActionableInsights.join(", ")}
      Competitors: ${safeCompetitors.map((competitor) => competitor?.name).filter(Boolean).join(", ")}
      Market Trends: ${safeMarketTrends.trendSummary || ""}
    `;

    const score = await runNamedChain(
      "score",
      () => runScoreChain(analysisForScoring),
      () => Math.min(100, Math.max(0, 40 + safeSwot.strengths.length * 5 + safeMarketTrends.trends.length * 2)),
      warnings
    );

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
      warnings: [...warnings],
    };
  } catch (error) {
    console.error("An error occurred during the idea validation process:", error);
    throw error;
  }
}