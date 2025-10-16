import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePDF } from "@/lib/utils/generatePDF";

const validationSchema = z.object({
  htmlContent: z.string().min(1, { message: "HTML content is required." }),
  cssContent: z.string().min(1, { message: "CSS content is required." }),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validationResult = validationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { htmlContent, cssContent } = validationResult.data;

    const pdfBuffer = await generatePDF(htmlContent, cssContent);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="startup-idea-report.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred while generating the PDF.",
      },
      { status: 500 }
    );
  }
}