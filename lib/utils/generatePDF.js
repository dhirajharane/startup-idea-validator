import puppeteer from "puppeteer";

export async function generatePDF(htmlContent, cssContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          ${cssContent}
          /* Additional styles for PDF printing */
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
          /* Overrides for PDF generation */
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

  await page.setContent(fullHtml, { waitUntil: "networkidle0" });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "25px",
      right: "25px",
      bottom: "25px",
      left: "25px",
    },
  });

  await browser.close();
  return pdfBuffer;
}
