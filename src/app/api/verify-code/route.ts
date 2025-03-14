import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schema/signupSchema";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, verifiedCode } = await req.json();
        const decodeUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({
            username: decodeUsername,
        });

        if (!user) {
            return Response.json(
                {
                    message: "User not found",
                    success: false,
                },
                {
                    status: 404
                }
            );
        }
        const isCodeValid = (user.verifiedCode === verifiedCode) && (user.verifieCodeExpiry > new Date());
        if (isCodeValid) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    message: "User verified successfully",
                    success: true,
                },
                {
                    status: 200
                }
            );
        }
        return Response.json(
            {
                message: "Invalid code",
                success: false,
            },
            {
                status: 400
            }
        );
        
    } catch (err) {
        console.error("ERROR" , err);
        return Response.json(
            {
                message: "Error verifying code",
                success: false,
            },
            {
                status: 500
            }
        );
    }
}