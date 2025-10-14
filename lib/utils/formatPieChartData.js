export function formatPieChartData(data) {
  const { swot, monetization, actionableInsights, competitors, marketTrends } = data;

  let scores = {
    marketPotential: 50,
    feasibility: 50,
    competition: 50,
    monetization: 50,
    innovation: 50,
  };

  scores.innovation += (swot.strengths?.length || 0) * 5;
  scores.feasibility += (actionableInsights?.length || 0) * 3 - (swot.weaknesses?.length || 0) * 4;
  scores.marketPotential += (swot.opportunities?.length || 0) * 4 + (marketTrends?.length || 0) * 2;
  scores.competition -= (swot.threats?.length || 0) * 5 + (competitors?.length || 0) * 4;
  scores.monetization += (monetization?.length || 0) * 5;

  Object.keys(scores).forEach(key => {
    scores[key] = Math.max(5, scores[key]);
  });

  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const pieChartData = {
    marketPotential: 0,
    feasibility: 0,
    competition: 0,
    monetization: 0,
    innovation: 0,
  };

  if (total > 0) {
    pieChartData.marketPotential = Math.round((scores.marketPotential / total) * 100);
    pieChartData.feasibility = Math.round((scores.feasibility / total) * 100);
    pieChartData.competition = Math.round((scores.competition / total) * 100);
    pieChartData.monetization = Math.round((scores.monetization / total) * 100);
    pieChartData.innovation = Math.round((scores.innovation / total) * 100);
  }

  const pieTotal = Object.values(pieChartData).reduce((sum, value) => sum + value, 0);
  if (pieTotal !== 100) {
    const diff = 100 - pieTotal;
    const maxKey = Object.keys(pieChartData).reduce((a, b) => pieChartData[a] > pieChartData[b] ? a : b);
    pieChartData[maxKey] += diff;
  }

  return pieChartData;
}