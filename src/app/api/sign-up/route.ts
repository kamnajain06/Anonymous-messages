import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) { //REQUEST
    await dbConnect(); //DB CONNECT
    try {
        await request.json(); 
        const { username, email, password } = await request.json();
        const userAlreadyExistsByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (userAlreadyExistsByUsername) {
            return Response.json(
                {
                    message: "User already exists",
                    success: false,
                },
                {
                    status: 400
                }
            )
        } 
        const userAlreadyExistsByEmail = await UserModel.findOne({
            email
        })
        const verifiedCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (userAlreadyExistsByEmail) {
            // If user already exists and is verified
            if (userAlreadyExistsByEmail.isVerified) {
                return Response.json({
                    message: "User already exists",
                    success: false,
                },
                    {
                        status: 400
                    }
                )
            } else { // If user already exists but is not verified
                const hashedPassword = await bcrypt.hash(password, 10);
                userAlreadyExistsByEmail.password = hashedPassword;
                userAlreadyExistsByEmail.verifiedCode = verifiedCode;
                userAlreadyExistsByEmail.verifieCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
                await userAlreadyExistsByEmail.save();
            }
        } else { // If user does not exist 
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifiedCode: verifiedCode,
                verifieCodeExpiry: new Date(Date.now() + 15 * 60 * 1000),
                isAccepting: true,
                messages: [],
            });
            await newUser.save();
            
        }
        // Send verification email
        const { message, success } = await sendVerificationEmail(email, username, verifiedCode);
            return Response.json({
                message,
                success,
            }, {
                status: 201
            })


    } catch (err) {
        console.error(err);
        return Response.json({
            message: "Error signing up",
            success: false,
        },
            {
                status: 500
            }
        )
    }
}   