import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/config/database";
import { createOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await dbConnect();
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const { otp, expires } = createOTP();

    let user = existingUser;
    if (user && !user.isVerified) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
      user.otp = otp.toString();
      user.otpExpires = expires;
    } else {
      user = new User({
        firstName,
        lastName,
        email,
        password,
        isVerified: false,
        otp: otp.toString(),
        otpExpires: expires,
      });
    }

    await user.save();
    await sendOTPEmail(email, otp.toString());

    return NextResponse.json(
      { message: "OTP sent to your email for verification." },
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