import {
    ActionIcon,
    Badge,
    Button,
    Group,
    Modal,
    Pagination,
    Paper,
    Skeleton,
    Stack,
    Table,
    Tabs,
    Text,
    Title,
} from "@mantine/core";
import {
    IconEye,
    IconMoodEmpty,
    IconPencil,
    IconTrash,
    IconUser,
} from "@tabler/icons";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PublicSharedStoryEditor from "../../editors/public_shared_story_editor/PublicSharedStoryEditor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

//type == self or profile
export default function PublicSharedStories() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [modalOpened, setModalOpened] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [modalMode, setModalMode] = useState("");
    const [activeTab, setActiveTab] = useState("profile");

    const queryClient = useQueryClient();

    const docsQuery = useQuery({
        queryKey: ["my-article-shared-stories", page, activeTab],
        //enabled: false,
        refetchOnWindowFocus: false,
        enabled: status === "authenticated" && router.isReady,
        queryFn: async () => {
            if (activeTab === "profile")
                return axios.get(
                    `/api/article-shared-written-stories/shared-stories-of/${router.query.id}?p=${page}`
                );
            return axios.get(
                `/api/article-shared-written-stories/shared-by/?p=${page}`
            );
        },
        onSuccess: (result) => {},
    });

    const docsMutate = useMutation({
        mutationFn: async () => {
            return axios.delete(
                `/api/article-shared-written-stories/${rowSelected?._id}`
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: "my-article-shared-stories",
            });
            setModalOpened(false);
        },
    });

    if (docsQuery.isError) return <div>ERROR</div>;
    /*if (docsQuery.isLoading || !router.isReady || status === "loading")
        return (
            <Stack>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={12} radius="xl" />
                ))}
            </Stack>
        );*/

    return (
        <Stack miw="100%">
            <Stack spacing={0}>
                <Title>
                    {activeTab === "profile"
                        ? "Shared Stories of Profile"
                        : "Shared by You"}
                </Title>
                <Text color="dimmed">
                    Written stories shared to the TigrayWiki Timeline
                </Text>
                <Tabs
                    //variant="outline"
                    radius="md"
                    orientation="horizontal"
                    defaultValue="profile"
                    value={activeTab}
                    p={10}
                    onTabChange={setActiveTab}
                >
                    <Tabs.List
                        sx={{
                            width: "100%",
                            flexWrap: "noWrap",
                            overflowX: "auto",
                            padding: "5px",
                            borderBottom: "0px",
                            backgroundColor: "white",
                        }}
                        grow
                    >
                        <Tabs.Tab value="profile">This Profile</Tabs.Tab>
                        <Tabs.Tab
                            value="privacy"
                            disabled={session?.user.id !== router?.query.id}
                        >
                            Shared by me
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </Stack>
            <Paper withBorder p="sm" radius="1.5em">
                <Stack sx={{ overflowX: "auto" }}>
                    <Table striped highlightOnHover withBorder width="100%">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Shared to</th>
                                <th>Privacy</th>
                                <th>Date Shared</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {docsQuery.data?.data?.data?.docs.map((doc) => {
                                return (
                                    <tr key={doc._id}>
                                        <td>{doc?.title}</td>
                                        <td>{doc?.articleTitle}</td>
                                        <td>
                                            {doc?.isAnnon ? (
                                                <Badge color="blue">
                                                    annonymous
                                                </Badge>
                                            ) : (
                                                <Badge color="green">
                                                    public
                                                </Badge>
                                            )}
                                        </td>
                                        <td>
                                            {moment(doc?.updatedAt).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </td>
                                        <td>
                                            <Stack spacing={2} align="center">
                                                <ActionIcon
                                                    size="sm"
                                                    c="blue"
                                                    variant="transparent"
                                                    onClick={() => {
                                                        setRowSelected(doc);
                                                        setModalMode("edit");
                                                        setModalOpened(true);
                                                    }}
                                                >
                                                    <IconPencil />
                                                </ActionIcon>
                                                <ActionIcon
                                                    size="sm"
                                                    c="red"
                                                    onClick={() => {
                                                        setRowSelected(doc);
                                                        setModalMode("delete");
                                                        setModalOpened(true);
                                                    }}
                                                >
                                                    <IconTrash />
                                                </ActionIcon>
                                            </Stack>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    {docsQuery.data?.data?.data?.pagination?.count === 0 && (
                        <Stack align="center" justify="center" spacing={0}>
                            <IconMoodEmpty opacity="0.5" size={30} />
                            <Text color="gray">No shared stories yet</Text>
                        </Stack>
                    )}
                    <Pagination
                        page={page}
                        onChange={setPage}
                        total={
                            docsQuery.data?.data?.data?.pagination?.pageCount
                        }
                        siblings={1}
                        initialPage={1}
                        position="center"
                    />
                </Stack>

                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                >
                    {modalMode === "delete" && (
                        <Stack align="center">
                            <Text>Are you sure you want to proceed</Text>
                            <Text>
                                Selected Document{" "}
                                <Text
                                    span
                                    color="red"
                                >{`${rowSelected?.firstName} ${rowSelected?.middleName}`}</Text>
                            </Text>
                            <Group grow>
                                <Button
                                    color="gray"
                                    onClick={() => setModalOpened(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="red"
                                    onClick={() => docsMutate.mutate()}
                                    loading={docsMutate.isLoading}
                                >
                                    Delete
                                </Button>
                            </Group>
                        </Stack>
                    )}
                    {modalMode === "edit" && (
                        <PublicSharedStoryEditor
                            sharedStory={rowSelected}
                            setModalOpened={setModalOpened}
                        />
                    )}
                </Modal>
            </Paper>
        </Stack>
    );
}
