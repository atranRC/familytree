/*
    on sign in, redirect user to a custom page where they can add info about themselves
*/

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import AppShellContainer from "../../../components/appShell";
import { Button } from "@mantine/core";
import { ResponsiveNav } from "../../../components/navBar";

export default function AuthDemo() {
    const { data: session } = useSession();
    console.log(session);
    if (session) {
        return (
            <AppShellContainer>
                Signed In as {session.user.email}
                <Link
                    href="/api/auth/signout"
                    onClick={(e) => {
                        e.preventDefault();
                        signOut();
                    }}
                >
                    signout
                </Link>
                <button onClick={() => console.log(session)}>sesssion</button>
            </AppShellContainer>
        );
    }
    return (
        <div>
            <Link
                href="/api/auth/signin"
                onClick={(e) => {
                    e.preventDefault();
                    signIn();
                }}
            >
                signin
            </Link>
        </div>
    );
}
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    return {
        props: {
            session,
        },
    };
}
