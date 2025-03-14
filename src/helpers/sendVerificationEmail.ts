import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../templates/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifiedCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Await the render output if render returns a Promise
    const emailHTML = await render(VerificationEmail({ username, otp: verifiedCode }));

    // Send the email
    const info = await transporter.sendMail({
      from: '"Anonymous Messages" <edtechcodegen@gmail.com>',
      to: email,
      subject: "Verify your email address",
      html: emailHTML,
    });

    console.log("Email sent:", info);
    return {
      message: "Verification email sent",
      success: true,
    };
  } catch (err: any) {
    console.error(err);
    return {
      message: "Error sending email",
      success: false,
    };
  }
}