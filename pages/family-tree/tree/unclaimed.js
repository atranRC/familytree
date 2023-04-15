import {
    Badge,
    Button,
    createStyles,
    Group,
    MediaQuery,
    Paper,
    Radio,
    SimpleGrid,
    Stack,
    Table,
    TextInput,
    Title,
} from "@mantine/core";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import AppShellContainer from "../../../components/appShell";
import { TreePageTitleSection } from "../../../components/titleSections";
import TreesNav from "../../../components/tree-page/modals/navigation/treePageNav";
import dbConnect from "../../../lib/dbConnect";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function UnclaimedProfilesPage({
    ownerData,
    unclaimedProfiles2,
}) {
    const useStyles = createStyles((theme) => ({
        treeLink: {
            textDecoration: "none",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();

    const unclaimedProfilesRow = unclaimedProfiles2.map((p) => (
        <tr key={p._id.toString()}>
            <td>
                <Link
                    href={`/profiles/${p._id.toString()}/claim-requests`}
                    className={classes.treeLink}
                >
                    {p.name}
                </Link>
            </td>
            <td>
                {p.current_residence
                    ? p.current_residence.value
                    : "unknown location"}
            </td>
        </tr>
    ));

    return (
        <AppShellContainer>
            <TreePageTitleSection picUrl="https://img.freepik.com/free-vector/recruit-agent-analyzing-candidates_74855-4565.jpg">
                <Title order={2} fw={600}>
                    Unclaimed Profiles
                </Title>
                <Title order={5} fw={400} color="dimmed">
                    Profiles that you have created in your family tree
                </Title>
            </TreePageTitleSection>
            <MediaQuery smallerThan="sm" styles={{ padding: "0px" }}>
                <Paper withBorder p="md" bg="white">
                    <TreesNav activePage={"unclaimed"} />

                    <Paper withBorder p="md" bg="#f7f9fc" mt="md">
                        <Table striped highlightOnHover withBorder bg="white">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>{unclaimedProfilesRow}</tbody>
                        </Table>
                    </Paper>
                </Paper>
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

    await dbConnect();

    const user = await Users.findOne({ email: session.user.email });

    //unclaimed accounts
    const unclaimedProfiles = await Users.find({
        owner: user._id.toString(),
    });
    console.log("unclaimed profilesss", unclaimedProfiles);

    const unclaimedProfiles2 = JSON.parse(JSON.stringify(unclaimedProfiles));
    const ownerData = JSON.parse(JSON.stringify(user));

    return {
        props: {
            session,
            ownerData,
            unclaimedProfiles2,
        },
    };
}
