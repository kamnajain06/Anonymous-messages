import { resend } from "@/lib/resend";
import VerificationEmail from "../../templates/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifiedCode: string): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'kamnaambitious@gmail.com',
            to: email,
            subject: "Anonymous-Messages : Verify your email",
            react: VerificationEmail({username, otp : verifiedCode}),
        });
        return {
            message: "Verification email sent",
            success: true,
        }
    } catch (error) {
        console.log("Error sending email");
        return {
            message: (error as Error).message,
            success: false,
        }
    }
}