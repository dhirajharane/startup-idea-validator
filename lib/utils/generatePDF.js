import puppeteer from "puppeteer";

export async function generatePDF(report) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const pieChartData = Object.entries(report.pieChartData)
    .map(([key, value]) => `<li>${key}: ${value}%</li>`)
    .join("");

  const content = `
    <html>
      <body>
        <h1>Startup Idea Validation Report</h1>
        <h2>${report.startupIdea}</h2>
        <h3>Summary</h3>
        <p>${report.summary}</p>
        <h3>Conclusion</h3>
        <p>${report.conclusion}</p>
        <h3>SWOT Analysis</h3>
        <ul>
            <li>Strengths: ${report.swot.strengths.join(", ")}</li>
            <li>Weaknesses: ${report.swot.weaknesses.join(", ")}</li>
            <li>Opportunities: ${report.swot.opportunities.join(", ")}</li>
            <li>Threats: ${report.swot.threats.join(", ")}</li>
        </ul>
        <h3>Pie Chart Data</h3>
        <ul>${pieChartData}</ul>
      </body>
    </html>
  `;

  await page.setContent(content);
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();
  return pdfBuffer;
}