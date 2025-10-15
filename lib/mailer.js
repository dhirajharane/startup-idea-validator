import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_PORT === "465", 
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const getEmailHtml = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f2f2f7;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e5ea;
        }
        .header {
            background-color: #6c63ff;
            color: #ffffff;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 32px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 24px;
        }
        .otp-code {
            display: inline-block;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #6c63ff;
            background-color: #f2f2f7;
            padding: 16px 24px;
            border-radius: 8px;
            margin: 0 auto 24px;
        }
        .footer {
            background-color: #f2f2f7;
            color: #8a8a8e;
            padding: 24px;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>StartupInspector Verification</h1>
        </div>
        <div class="content">
            <p>Here is your One-Time Password (OTP) to proceed. This code is valid for 10 minutes.</p>
            <div class="otp-code">${otp}</div>
            <p>If you did not request this code, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} StartupInspector. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your StartupInspector OTP",
      html: getEmailHtml(otp),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Could not send OTP email.");
  }
}
