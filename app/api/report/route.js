import { NextResponse } from "next/server";
import { z } from "zod";
import { runIdeaValidatorChains } from "@/lib/chains/index";

// Define the schema for input validation using Zod.
const validationSchema = z.object({
  startupIdea: z
    .string({ invalid_type_error: "Startup idea must be a string." })
    .min(10, { message: "Startup idea must be at least 10 characters long." }),
});

/**
 * @description Handles POST requests to generate a validation report for a startup idea.
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<NextResponse>} A JSON response with the report or an error.
 */
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate the request body against the schema.
    const validationResult = validationSchema.safeParse(body);

    if (!validationResult.success) {
      // Return a structured error response if validation fails.
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { startupIdea } = validationResult.data;

    // Execute the main logic
    const report = await runIdeaValidatorChains(startupIdea);

    return NextResponse.json({ success: true, data: report });
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