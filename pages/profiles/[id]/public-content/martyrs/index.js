import dbConnect from "../../../../../lib/dbConnect";

import Users from "../../../../../models/Users";
//import { authOptions } from "../../api/auth/[...nextauth]";
import { authOptions } from "../../../../api/auth/[...nextauth]";
//import TreeMembersB from "../../../models/TreeMembersB";
import TreeMembersB from "../../../../../models/TreeMembersB";
import axios from "axios";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Container, MediaQuery, Stack, Title } from "@mantine/core";
import AppShellContainer from "../../../../../components/appShell";
import { ProfileTitleSection } from "../../../../../components/titleSections";
import SecondaryNavbar from "../../../../../components/profiles_page/SecondaryNavbar";
import AddMart from "../../../../../components/v2/forms/add_mart/AddMart";
import UploadedMarts from "../../../../../components/v2/tables/uploaded_marts/UploadedMarts";

export default function MyWikisMartyrsPage({
    sessionUserJson,
    profileUserJson,
    sessionProfileRelation,
}) {
    const router = useRouter();
    const id = router.query.id;

    if (sessionProfileRelation !== "self") return <div>ACCESS DENIED</div>;

    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {profileUserJson.name}
                </Title>
                <Title order={5} fw={500}>
                    Martyrs
                </Title>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"martyrs"}
                id={id}
                sessionProfileRelation={sessionProfileRelation}
            />
            <MediaQuery
                smallerThan="sm"
                styles={{ padding: "0px", paddingTop: "10px" }}
            >
                <Container pt="md">
                    <Stack spacing="sm">
                        <Title color="gray" mt="md">
                            Martyrs you added
                        </Title>
                        <UploadedMarts sessionUserId={sessionUserJson._id} />
                        <Title color="gray" mt="md">
                            Add a Martyr
                        </Title>
                        <AddMart sessionUserId={sessionUserJson._id} />
                    </Stack>
                </Container>
            </MediaQuery>
        </AppShellContainer>
    );
}

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    //console.log(session);
    //console.log("contexttt", context.query.id);
    //get claim requests for context.query.id
    await dbConnect();

    //fetch session user and profile user
    const sessionUserPromise = Users.findOne({ email: session.user.email });
    const profileUserPromise = Users.findById(context.query.id);
    const [sessionUser, profileUser] = await Promise.all([
        sessionUserPromise,
        profileUserPromise,
    ]);
    const sessionUserJson = JSON.parse(JSON.stringify(sessionUser));
    const profileUserJson = JSON.parse(JSON.stringify(profileUser));

    let sessionProfileRelation = "none";
    //session mode = 'self', 'owner', or 'relative'
    //if profile not session user's or session user not owner of profile
    if (sessionUser._id.toString() === context.query.id) {
        sessionProfileRelation = "self";
    } else {
        if (profileUser.owner === sessionUser._id.toString()) {
            sessionProfileRelation = "owner";
        } else {
            //check if session user inside allowed common tree of profile

            //fetch profile trees where post = true
            const profileUserTreesPromise = TreeMembersB.find({
                taggedUser: context.query.id,
                canPost: true,
            });
            //fetch session trees
            const sessionUserTreesPromise = TreeMembersB.find({
                taggedUser: sessionUser._id.toString(),
            });
            const [profileUserTrees, sessionUserTrees] = await Promise.all([
                profileUserTreesPromise,
                sessionUserTreesPromise,
            ]);

            const profileUserTreesJson = JSON.parse(
                JSON.stringify(profileUserTrees)
            );

            const sessionUserTreesJson = JSON.parse(
                JSON.stringify(sessionUserTrees)
            );
            //check if session in one of profile trees
            const profileUserTreesId = profileUserTreesJson.map(
                (t) => t.treeId
            );
            const sessionUserTreesId = sessionUserTreesJson.map(
                (t) => t.treeId
            );
            const canPost = sessionUserTreesId.some(
                (r) => profileUserTreesId.indexOf(r) >= 0
            );
            if (canPost) {
                sessionProfileRelation = "relative";
            }
        }
    }

    /*console.log(
        "session profile relation is",
        sessionProfileRelation,
        sessionUserJson._id
    );*/

    return {
        props: {
            session,
            sessionUserJson,
            profileUserJson,
            sessionProfileRelation,
            //sessionUserCanPost,
            //allReqs2,
            //profileData,
            //allUsersData,
            //ownerData,
            //treesData,
            //treesImInData2,
            //myCollabsTrees2,
        },
    };
}
