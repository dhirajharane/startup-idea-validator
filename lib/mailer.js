import nodemailer from "nodemailer";

function getTransporter() {
    const host = process.env.EMAIL_SERVER_HOST?.trim();
    const port = Number(process.env.EMAIL_SERVER_PORT || 465);
    const user = process.env.EMAIL_SERVER_USER?.trim();
    const password = process.env.EMAIL_SERVER_PASSWORD;

    if (!host || !Number.isInteger(port) || !user || !password) {
        throw new Error("Email service environment variables are not configured.");
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass: password },
    });
}

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
        const from = process.env.EMAIL_FROM?.trim() || process.env.EMAIL_SERVER_USER?.trim();
        if (!from) {
            throw new Error("EMAIL_FROM or EMAIL_SERVER_USER must be configured.");
        }

        const mailOptions = {
            from,
      to: email,
      subject: "Your StartupInspector OTP",
      html: getEmailHtml(otp),
    };

    await getTransporter().sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Could not send OTP email.");
  }
}
