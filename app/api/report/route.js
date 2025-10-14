import { NextResponse } from "next/server";
import { z } from "zod";
import { runIdeaValidatorChains } from "@/lib/chains";
import { structuredOutputSchema } from "@/lib/utils/structuredOutputSchema";

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
      throw new Error("Failed to generate report.");
    }

    const validatedReport = structuredOutputSchema.parse(report);

    return NextResponse.json({ success: true, data: validatedReport });
  } catch (error) {
    console.error("Error generating startup idea report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}