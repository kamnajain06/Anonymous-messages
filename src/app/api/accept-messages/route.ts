import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { returnResponse } from "@/helpers/returnResponse";
import { User } from "next-auth";
import { request } from "http";

export async function POST(req: any, res: any) {
    dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return returnResponse(401, false, "Unauthorized access");
    }
    const userId = user._id;
    const { acceptMessages } = await req.json();
    try {
        const userData = await UserModel.findById(userId);
        if(!userData) {
            return returnResponse(404, false, "User not found");
        }
        userData.isAccepting = acceptMessages;
        await userData.save();
        return returnResponse(200, true, "Messages accepted successfully", userData);

    } catch (err) {
        console.error(err);
        return returnResponse(500, false, "Error accepting messages");
    }

}

export async function GET(req: any, res: any) {
    dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return returnResponse(401, false, "Unauthorized access");
    }
    const userId = user._id;
    try {
        const userData = await UserModel.findById(userId);
        if(!userData) {
            return returnResponse(404, false, "User not found");
        }
        return returnResponse(200, true, "", userData.isAccepting);

    } catch (err) {
        console.error(err);
        return returnResponse(500, false, "Error accepting messages");
    }
}