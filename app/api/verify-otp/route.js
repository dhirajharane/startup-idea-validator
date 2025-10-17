import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/config/database";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp, purpose } = await req.json();

    if (!email || !otp || !purpose) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpires +loginToken +loginTokenExpires");

    if (!user || !user.otp || new Date() > user.otpExpires) {
      return NextResponse.json({ message: "Invalid or expired OTP." }, { status: 400 });
    }
    
    const isMatch = user.otp === otp;

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid OTP provided." }, { status: 400 });
    }

    user.otp = undefined;
    user.otpExpires = undefined;

    if (purpose === 'signup') {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
      return NextResponse.json({ message: "Account verified successfully." }, { status: 200 });
    }

    if (purpose === 'login') {
      const loginToken = crypto.randomBytes(32).toString("hex");
      user.loginToken = loginToken;
      user.loginTokenExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity
      await user.save({ validateBeforeSave: false });
      return NextResponse.json({ loginToken }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid purpose specified." }, { status: 400 });

  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
  }
}