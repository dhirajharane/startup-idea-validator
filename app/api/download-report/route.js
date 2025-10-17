
import { NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt"; // Used to get the user session on the server
import { generatePDF } from "@/lib/utils/generatePDF";
import User from "@/lib/models/User"; // Import your User model
import dbConnect from "@/lib/config/database"; // Import your DB connection utility

export const runtime = "nodejs";

const validationSchema = z.object({
  htmlContent: z.string().min(1, { message: "HTML content is required." }),
  cssContent: z.string().min(1, { message: "CSS content is required." }),
});

export async function POST(req) {
  try {
    // 1. Authenticate the user
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }
    const userId = token.sub; // 'sub' is the standard JWT claim for subject (user ID)

    // 2. Validate the request body
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

    // 3. Generate the PDF
    const pdfBuffer = await generatePDF(htmlContent, cssContent);

    // 4. Increment the user's download count in the database
    await dbConnect(); // Ensure you are connected to the database
    await User.findByIdAndUpdate(userId, { $inc: { downloads: 1 } });

    // 5. Return the PDF to the client
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