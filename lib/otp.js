import crypto from "crypto";

const OTP_LENGTH = 6;
const OTP_VALIDITY_MINUTES = 10;

export function createOTP() {
  const otp = crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH);
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + OTP_VALIDITY_MINUTES);
  return { otp, expires };
}

export function verifyOTP(providedOTP, storedOTP, expires) {
  if (new Date() > expires) {
    return false;
  }
  return providedOTP === storedOTP;
}