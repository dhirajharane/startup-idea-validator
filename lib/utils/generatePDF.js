import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const createHtmlTemplate = (htmlContent, cssContent) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF--8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        ${cssContent}
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          div, section, motion.div {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
          }
          .print-hidden {
             display: none !important;
          }
        }
        body {
          background-color: #030712 !important;
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
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    const fullHtml = createHtmlTemplate(htmlContent, cssContent);

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdfOptions = {
      format: "A4",
      printBackground: true,
      margin: {
        top: "25px",
        right: "25px",
        bottom: "25px",
        left: "25px",
      },
      ...options,
    };

    const pdfBuffer = await page.pdf(pdfOptions);

    return pdfBuffer;

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate the PDF report.");

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}