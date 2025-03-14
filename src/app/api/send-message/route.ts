import UserModel from "@/model/User";
import MessageModel from "@/model/User";
import { returnResponse } from "@/helpers/returnResponse";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(req: any, res: any) {

    await dbConnect();
    const { username, content } = await req.json();
    try {
        const user = await UserModel
            .findOne({ username });
        
        if (!user) {
            return returnResponse(404, false, "User not found");
        }
        if (!user.isAccepting) {
            return returnResponse(403, false, "User is not accepting messages");
        }
        const newMessage = {
            content,
            createdAt: new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();
        
        MessageModel.create(newMessage);
        return returnResponse(200, true, "Message sent successfully", newMessage);

    } catch (err) {
        console.error(err);
        return returnResponse(500, false, "Error sending message");
    }
}