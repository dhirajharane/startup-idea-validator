import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/config/database";
import { createOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const { otp, expires } = createOTP();
    user.otp = otp;
    user.otpExpires = expires;
    await user.save();

    await sendOTPEmail(email, otp);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}