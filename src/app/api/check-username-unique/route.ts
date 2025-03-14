import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schema/signupSchema";

// query schema step-1
const usernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: Request) {
    await dbConnect();
    // localhost:3000/api/checkUsernameUnique?username=kamna?phon="apple"
    try {
        const { searchParams } = new URL(req.url);
        const queryParam = { //object 
            username: searchParams.get("username")
        }
        // validate with zod step-2
        const res = usernameQuerySchema.safeParse(queryParam);
        console.log("Result", res);
        if(!res.success) {
            return Response.json({
                status: 400,
                body: res.error.format().username?._errors || "Invalid username"
            });
        }
        const { username } = res.data;
        const user = await UserModel
            .findOne({ username, isVerified: true })
        
        if (user) {
            return Response.json(
                {
                    message: "Username already taken",
                    success: false,
                },
                {
                    status: 400
                }
            );
        }
        return Response.json(
            {
                message: "Username is unique",
                success: true,
            }
        );
    } catch (err) {
        console.error(err);
        return Response.json(
            {
                message: "Error checking username",
                success: false,
            },
            {
                status: 500
            }
        );
    }
}