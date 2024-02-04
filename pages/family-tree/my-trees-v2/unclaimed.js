/*import {
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
    //console.log("unclaimed profilesss", unclaimedProfiles);

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
*/
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import AppShellContainer from "../../../components/appShell";
import { ProfileTitleSection } from "../../../components/titleSections";
import {
    ActionIcon,
    Box,
    Button,
    Container,
    Group,
    MediaQuery,
    Modal,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import ProfileLoadingScreen from "../../../components/v2/loading_screens/profile_loading/ProfileLoadingScreen";
import TreesNav from "../../../components/tree-page/modals/navigation/treePageNav";
import MyUnclaimedProfilesTable from "../../../components/v2/tables/unclaimed_profiles/MyUnclaimedProfilesTable";
import UserViewerV2 from "../../../components/v2/viewers/user_viewer/UserViewer";

export default function UnclaimedProfilesPage() {
    const { data: session, status } = useSession();

    const [modalOpened, setModalOpened] = useState(false);
    const [modalViewMode, setModalViewMode] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

    const router = useRouter();

    const handleOnRowClick = (row, action = "") => {
        action === "view"
            ? setModalViewMode("view")
            : setModalViewMode("delete");
        setSelectedRow(row);
        setModalOpened(true);
    };

    if (status === "unauthenticated") return <div>Not logged in</div>;
    /*if (status === "loading")
        return <ProfileLoadingScreen>loading session...</ProfileLoadingScreen>;*/
    if (status === "loading")
        return <ProfileLoadingScreen>loading</ProfileLoadingScreen>;

    return (
        <AppShellContainer activePage="Trees">
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {session.user.name}
                </Title>
                <Title order={5} fw={500}>
                    Unclaimed Profiles
                </Title>
            </ProfileTitleSection>

            <MediaQuery
                smallerThan="sm"
                styles={{ padding: "0px", paddingTop: "10px" }}
            >
                <Container pt="md">
                    <Stack spacing="sm">
                        <Title order={1} align="center">
                            Unclaimed Profiles
                        </Title>
                        <Title order={4} c="dimmed" align="center">
                            Unclaimed Profiles you&apos;ve created and tagged in
                            your Family Trees
                        </Title>

                        <MyUnclaimedProfilesTable
                            onRowClick={handleOnRowClick}
                        />
                    </Stack>
                </Container>
            </MediaQuery>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                padding={modalViewMode === "delete" ? 0 : "sm"}
                radius="1.5rem"
                withCloseButton={modalViewMode === "delete" ? false : true}
            >
                {modalViewMode === "view" && (
                    <UserViewerV2 user={selectedRow} />
                )}
                {modalViewMode === "delete" && (
                    <Box
                        sx={{
                            backgroundColor: "#FF7F7F",

                            borderRadius: "1.5rem",
                        }}
                        p="sm"
                    >
                        <Paper withBorder p="sm" radius="1.5rem">
                            <Stack>
                                <Stack
                                    spacing={0}
                                    justify="center"
                                    align="center"
                                >
                                    <Title order={4} align="center" color="red">
                                        {selectedRow?.name}
                                    </Title>
                                    <Title order={5} align="center">
                                        Are you sure you want to delete this
                                        Unclaimed Profile?
                                    </Title>
                                    <Text fz="xs" color="gray" align="center">
                                        All Events, Written Stories, and Audio
                                        Stories will be deleted forever
                                    </Text>
                                </Stack>
                                <Group position="center">
                                    <Button color="red">Delete</Button>
                                    <Button
                                        color="gray"
                                        onClick={() => setModalOpened(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Group>
                            </Stack>
                        </Paper>
                    </Box>
                )}
            </Modal>
        </AppShellContainer>
    );
}
