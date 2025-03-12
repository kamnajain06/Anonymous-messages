import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';

dotenv.config();

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}; //data type optional

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log('Using existing connection');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        console.log('DB', db);

        connection.isConnected = db.connections[0].readyState;
        console.log('DB Connected successfully');
        
    } catch (err) {
        console.error("Database Connection failed", err);
        process.exit(1)
    }
}

export default dbConnect;