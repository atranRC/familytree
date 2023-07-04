import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";

export const authOptions = {
    providers: [
        /*GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            httpOptions: {
                timeout: 10000,
            },
        }),*/
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXT_PUBLIC_SECRET,
    callbacks: {
        session: async ({ session, user }) => {
            if (session?.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        newUser: "/u/new-user",
    },
    adapter: MongoDBAdapter(clientPromise, {
        databaseName: "famtree",
    }),
    /*events: {
        async signIn(message) {
            console.log("hello");
            console.log(await message);
        },
    },*/
};

export default NextAuth(authOptions);
