import puppeteer from "puppeteer"; // NOT puppeteer-core

const createHtmlTemplate = (htmlContent, cssContent) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          font-family: 'Outfit', 'Segoe UI', Roboto, Arial, sans-serif;
          background-color: #030712 !important;
        }

        ${cssContent}

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          div, section {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
          }
          .print-hidden {
            display: none !important;
          }
        }

        .recharts-wrapper {
          display: block !important;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
  </html>
`;

export async function generatePDF(htmlContent, cssContent, options = {}) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const fullHtml = createHtmlTemplate(htmlContent, cssContent);
    await page.setContent(fullHtml, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "25px", right: "25px", bottom: "25px", left: "25px" },
      ...options,
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate the PDF report.");
  } finally {
    if (browser) await browser.close();
  }
}
