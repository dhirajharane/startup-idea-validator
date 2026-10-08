import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/config/database";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await dbConnect();
    const { firstName, lastName, email: rawEmail, password } = await req.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = new User({ firstName, lastName, email, password });

    await user.save();

    return NextResponse.json(
      { message: "Account created successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}