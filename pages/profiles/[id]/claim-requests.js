import {
    Badge,
    Container,
    createStyles,
    Modal,
    Paper,
    Table,
    Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { MediaQuery } from "@mantine/core";
import AppShellContainer from "../../../components/appShell";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";
import {
    ProfileTitleSection,
    TitleSection,
} from "../../../components/titleSections";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
//import dbConnect from "../../../lib/dbConnect";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { ClaimRequestModalContent } from "../../../components/profiles_page/modals/ClaimRequestModals";
import dbConnect from "../../../lib/dbConnect";
import Users from "../../../models/Users";

export default function ClaimRequestsPage({
    allReqs2,
    profileData,
    sessionProfileRelation,
}) {
    const useStyles = createStyles((theme) => ({
        treeLink: {
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();
    const router = useRouter();
    const id = router.query.id;

    const [requestModalOpened, setRequestModalOpened] = useState(false);
    const [requestToView, setRequestToView] = useState(null);
    const picUrl =
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80";

    const rows = allReqs2.map((r) => {
        let color = "yellow";
        if (r.status === "approved") {
            color = "green";
        }
        if (r.status === "declined") {
            color = "red";
        }

        return (
            <tr key={r._id.toString()}>
                <td>
                    <div
                        onClick={() => {
                            setRequestToView(r);
                            setRequestModalOpened(true);
                        }}
                        className={classes.treeLink}
                    >
                        {r.claimerName}
                    </div>
                </td>
                <td>{r.name}</td>
                <td>{r.message}</td>
                <td>
                    <Badge color={color}>{r.status}</Badge>
                </td>
            </tr>
        );
    });

    if (sessionProfileRelation === "none") {
        return <div>RESTRICTED PAGE</div>;
    }

    return (
        <AppShellContainer>
            <ProfileTitleSection
                picUrl={profileData.image ? profileData.image : ""}
            >
                <Title order={2} fw={600}>
                    {profileData.name}
                </Title>
                <Title order={5} fw={400} color="dimmed">
                    {profileData.current_residence}
                </Title>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"claim-requests"}
                id={id}
                sessionProfileRelation={sessionProfileRelation}
            />
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Container mt="mt">
                    {allReqs2 && allReqs2.length} {id}
                    <Paper withBorder p="md" bg="#f7f9fc">
                        <Table striped highlightOnHover withBorder bg="white">
                            <thead>
                                <tr>
                                    <th>Requested By</th>
                                    <th>Requested Profile</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </Table>
                    </Paper>
                </Container>
            </MediaQuery>
            <Modal
                opened={requestModalOpened}
                onClose={() => setRequestModalOpened(false)}
                title="Claim Request"
            >
                <ClaimRequestModalContent claimRequest={requestToView} />
            </Modal>
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

    //check sessionProfileRelation
    let sessionProfileRelation = "none";
    //session mode = 'self', 'owner', or 'relative'
    //if profile not session user's or session user not owner of profile
    if (sessionUser._id.toString() === context.query.id) {
        sessionProfileRelation = "self";
    } else {
        if (profileUser.owner === sessionUser._id.toString()) {
            sessionProfileRelation = "owner";
        }
    }

    console.log(
        "session profile relation is",
        sessionProfileRelation,
        sessionUserJson._id
    );

    const fetchAll = await Promise.all([
        axios.get(
            process.env.API_BASE_URL +
                "/api/claim-requests-api/requests-for/" +
                context.query.id
        ),
        axios.get(process.env.API_BASE_URL + "/api/users/" + context.query.id),
    ]).catch((error) => {
        console.log(error);
    });

    const allReqs2 = JSON.parse(JSON.stringify(await fetchAll[0].data.data));
    const profileData = JSON.parse(JSON.stringify(await fetchAll[1].data.data));

    /* const requestsFor = await axios.get(
        "/api/claim-requests-api/requests-for/" +
            context.query.id
    );
    const allReqs = await requestsFor.data;
    const allReqs2 = JSON.parse(JSON.stringify(allReqs.data));*/

    /*const userByEmail = await axios.get(
        "/api/users/users-mongoose/" + session.user.email
    );
    const ownerData = await userByEmail.data.data;*/
    //await dbConnect();
    //let trees = [];

    /*Users.findOne({ email: session.user.email }, function (err, user) {
        FamilyTrees.find(
            { owner: user._id.toString() },
            async function (err, docs) {
                trees = await docs;
            }
        );
    });*/
    /*const user = await Users.findOne({ email: session.user.email });
    const trees = await FamilyTrees.find({ owner: user._id.toString() });

    //trees i'm in
    const treesImIn = await TreeMembers.find({ id: user._id.toString() });
    const treesImInIds = treesImIn.map((t) => {
        return ObjectId(t.treeId);
    });
    const treesImInData = await FamilyTrees.find({
        _id: { $in: treesImInIds },
    });*/
    //console.log("trees im in", treesImInData);

    //collaborations
    /* const myCollabs = await Collabs.find({ userId: user._id.toString() });
    const myCollabsIds = myCollabs.map((c) => {
        return ObjectId(c.treeId);
    });
    const myCollabsTrees = await FamilyTrees.find({
        _id: { $in: myCollabsIds },
    });
    console.log("my collabs", myCollabsTrees);

    const treesData = JSON.parse(JSON.stringify(trees));
    const ownerData = JSON.parse(JSON.stringify(user));
    const treesImInData2 = JSON.parse(JSON.stringify(treesImInData));
    const myCollabsTrees2 = JSON.parse(JSON.stringify(myCollabsTrees));*/
    //console.log(trees);
    //console.log(ownerData);

    //console.log("these be the trees", trees);

    return {
        props: {
            session,
            allReqs2,
            profileData,
            sessionProfileRelation,
            //allUsersData,
            //ownerData,
            //treesData,
            //treesImInData2,
            //myCollabsTrees2,
        },
    };
}
