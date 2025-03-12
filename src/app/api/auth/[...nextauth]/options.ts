import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeHolder: "kamnajain18@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [ 
                            { email: credentials.email },
                            { username: credentials.username }
                        ]
                    });
                    if (!user) {
                        throw new Error("No user found with this email or username");
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified");
                    }
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                    if (!isValidPassword) {
                        throw new Error("Password is incorrect");
                    } else {
                        return user; // Return user object to the Providers
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAccepting = user.isAccepting;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAccepting = token.isAccepting;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/sign-in",
    },
    session: {
        strategy: "jwt", // bearer strategy
    },
    secret: process.env.SECRET,
};