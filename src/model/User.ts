import mongoose, { Schema, Document } from "mongoose"; // imported Schema and Document (TypeScript)

export interface Message extends Document {
    content: string; //TypeScript -> lowercase
    user: string; 
    createdAt: Date;
}

const messageSchema : Schema<Message> = new Schema({
    content: {
        type: String, //mongoose -> Capitalized
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});
export interface User extends Document {
    username: string;
    email: string; 
    password: string;
    verifiedCode: string;
    verifieCodeExpiry: Date;
    isAccepting: boolean;
    messages: Message[];  
    isVerified: boolean;
};

const userSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/igm, 'Please fill a valid email address'] //used RegExr
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    verifiedCode: {
        type: String,
        required: [true, 'Verified Code is required']
    },
    verifieCodeExpiry: {
        type: Date,
        required: [true, 'Verified Code Expiry is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAccepting: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema); //either use existing model or create new model
const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", messageSchema); //either use existing model or create new model
export default UserModel; //exporting UserModel

