import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import dbConnect from "@/lib/config/database";
import { verifyOTP } from "@/lib/otp";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user || !user.otp || !user.otpExpires) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const isValid = verifyOTP(otp, user.otp, user.otpExpires);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}