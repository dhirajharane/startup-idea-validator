export function generateScore({ swot, monetization, actionableInsights }) {
  let score = 50;
  let pieChartData = {
    marketPotential: 20,
    feasibility: 20,
    competition: 20,
    monetization: 20,
    innovation: 20,
  };

  score += (swot.strengths.length - swot.weaknesses.length) * 5;
  score += monetization.length * 5;
  score += actionableInsights.length * 2;

  score = Math.max(0, Math.min(100, score));

  pieChartData.monetization += monetization.length * 2;
  pieChartData.feasibility += actionableInsights.length;
  pieChartData.marketPotential += swot.opportunities.length * 2;
  pieChartData.competition -= swot.threats.length * 2;
  pieChartData.innovation += swot.strengths.length;

  const total = Object.values(pieChartData).reduce((sum, value) => sum + value, 0);
  for (const key in pieChartData) {
    pieChartData[key] = Math.round((pieChartData[key] / total) * 100);
  }

  return { score, pieChartData };
}