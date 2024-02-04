import { useRouter } from "next/router";
import { Container, MediaQuery, Stack, Title } from "@mantine/core";
import AppShellContainer from "../../../../components/appShell";
import { ProfileTitleSection } from "../../../../components/titleSections";
import AddMart from "../../../../components/v2/forms/add_mart/AddMart";
import UploadedMarts from "../../../../components/v2/tables/uploaded_marts/UploadedMarts";
import { useSession } from "next-auth/react";

export default function MyWikisMartyrsPage({
    sessionUserJson,
    profileUserJson,
    sessionProfileRelation,
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated") return <div>RESTRICTED</div>;
    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {session?.user.name}
                </Title>
                <Title order={5} fw={500}>
                    Martyrs
                </Title>
            </ProfileTitleSection>
            <MediaQuery
                smallerThan="sm"
                styles={{ padding: "0px", paddingTop: "10px" }}
            >
                <Container pt="md">
                    <Stack spacing="sm">
                        <Title color="gray" mt="md">
                            Martyrs you&apos;ve added
                        </Title>
                        <UploadedMarts sessionUserId={session?.user.id} />
                        <Title color="gray" mt="md">
                            Add a Martyr
                        </Title>
                        <AddMart sessionUserId={session?.user.id} />
                    </Stack>
                </Container>
            </MediaQuery>
        </AppShellContainer>
    );
}

/*
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
*/
