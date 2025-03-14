import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { returnResponse } from "@/helpers/returnResponse";
import mongoose from "mongoose";


export async function GET(req: any, res: any) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    
    if (!session || !session.user) {
        return returnResponse(401, false, "Unauthorized access");
    }
    
    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId  // match logged in user with the users in the database
                },
            },
            {
                $unwind: "$messages"  // spread the messages array into individual messages
            },
            {
                $sort: {
                    "messages.createdAt": -1 // sort the messages in descending order
                }
            },
            {
                $group: {
                    _id: "$_id", // group the messages by the user id
                    messages: {
                        $push: "$messages" // push the sorted messages back into the messages array
                    }
                }
            }
        ]);

        if(!user || user.length === 0) {
            return returnResponse(404, false, "User not found");
        }

        return returnResponse(200, true, "", user[0].messages); //return first object of the array

    } catch (err) {
        console.error(err);
        return returnResponse(500, false, "Error accepting messages");
    }
}