import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/config/database";
import { createOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
        return NextResponse.json(
            { message: "Account is not verified. Please sign up first." },
            { status: 403 }
        );
    }

    const { otp, expires } = createOTP();
    
    user.otp = otp.toString();
    user.otpExpires = expires;
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(email, otp.toString());

    return NextResponse.json(
      { message: "OTP sent to your email successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Request Login OTP error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}