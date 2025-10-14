import { NextResponse } from "next/server";
import { z } from "zod";
import { runIdeaValidatorChains } from "@/lib/chains";
import { generatePDF } from "@/lib/utils/generatePDF";

const validationSchema = z.object({
  startupIdea: z
    .string({ invalid_type_error: "Startup idea must be a string." })
    .min(10, { message: "Startup idea must be at least 10 characters long." }),
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

    const { startupIdea } = validationResult.data;
    const report = await runIdeaValidatorChains(startupIdea);

    if (!report) {
      throw new Error("Failed to generate report data.");
    }

    const pdfBuffer = await generatePDF(report);

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