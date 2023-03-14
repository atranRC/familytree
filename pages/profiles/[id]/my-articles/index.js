import {
    Badge,
    Container,
    createStyles,
    Divider,
    Group,
    MediaQuery,
    Pagination,
    Paper,
    Table,
    Title,
    Text,
    ActionIcon,
    Button,
    Modal,
    Stack,
    TextInput,
    Textarea,
    Select,
    Avatar,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconCalendarEvent, IconLocation, IconTrash } from "@tabler/icons";
import axios from "axios";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../../components/appShell";
import { DraftsTableSkeleton } from "../../../../components/profiles_page/my_articles_page/cards";
import SecondaryNavbar from "../../../../components/profiles_page/SecondaryNavbar";
import { ProfileTitleSection } from "../../../../components/titleSections";
import dbConnect from "../../../../lib/dbConnect";
import Users from "../../../../models/Users";
import { authOptions } from "../../../api/auth/[...nextauth]";
import { citiesData } from "../../../demo/auth-demo/cities";

export default function MyArticlesPage({ sessionUserJson }) {
    const router = useRouter();
    const id = router.query.id;

    const useStyles = createStyles((theme) => ({
        articleLink: {
            textDecoration: "none",
            color: "blue",
            cursor: "pointer",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();

    const SelectItem = forwardRef(
        ({ image, label, description, ...others }, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [articleToTakeDown, setArticleToTakeDown] = useState("");
    const [takeDownModal, setTakeDownModal] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");

    //fetch drafts by sessionUserJson._id
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-drafts-by",
        queryFn: () => {
            return axios.get(
                "/api/articles/articles-by/" +
                    sessionUserJson._id +
                    "?p=" +
                    page
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("articles by ", d.data.data);
        },
    });
    const {
        isLoading: isLoadingTakeDown,
        isFetching: isFetchingTakeDown,
        data: dataTakeDown,
        refetch: refetchTakeDown,
        isError: isErrorTakeDown,
        error: errorTakeDown,
    } = useQuery({
        queryKey: "take-down",
        queryFn: () => {
            return axios.put("/api/articles/" + articleToTakeDown, {
                isPublished: false,
            });
        },
        enabled: false,
        onSuccess: (d) => {
            setTakeDownModal(false);
            console.log("taken down ", d.data.data);
        },
    });

    const {
        isLoading: isLoadingStartNew,
        isFetching: isFetchingStartNew,
        data: dataStartNew,
        refetch: refetchStartNew,
        isError: isErrorStartNew,
        error: errorStartNew,
    } = useQuery({
        queryKey: "start-new",
        queryFn: () => {
            const bod = {
                authorId: sessionUserJson._id,
                authorName: sessionUserJson.name,
                articleId: null,
                title: title,
                description: description,
                content: "Start here...",
                location: null,
                date: date,
            };
            return axios.post("/api/article-drafts/", bod);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("created ", d.data.data);
            router.push(
                "/profiles/63cba5e271eb83f0f65d7d03/my-articles/drafts/" +
                    d.data.data._id
            );
        },
    });

    const rows =
        data &&
        data.data.data.articles.map((r) => {
            let color = "yellow";
            let status = "In draft";
            if (r.isPublished) {
                color = "green";
                status = "published";
            }

            return (
                <tr key={r._id.toString()}>
                    <td>{r.title}</td>
                    <td>{r.date.toString()}</td>
                    <td>
                        <Text truncate>{r.description}</Text>
                    </td>
                    <td>
                        <Badge color={color}>{status}</Badge>
                    </td>
                    <td>
                        <span className={classes.articleLink}>preview</span>
                        <Divider orientation="vertical" />
                        <span
                            className={classes.articleLink}
                            onClick={() => {
                                router.push(
                                    `/profiles/${sessionUserJson._id}/my-articles/drafts/${r.draftId}`
                                );
                            }}
                        >
                            edit
                        </span>
                        <Divider orientation="vertical" />
                        <ActionIcon
                            loading={isLoadingTakeDown || isFetchingTakeDown}
                            onClick={() => {
                                setArticleToTakeDown(r._id);
                                setTakeDownModal(true);
                            }}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                        {/*<span className={classes.articleLink} onClick={() => {
                            setArticleToTakeDown(r._id)

                        }}>take down</span>*/}
                    </td>
                </tr>
            );
        });

    const handleStartNew = () => {
        refetchStartNew();
        //console.log("start new", title, description, location, date);
    };

    useEffect(() => {
        if (data) {
            setPageCount(data.data.data.pagination.pageCount);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [page]);

    if (id !== sessionUserJson._id) {
        return <div>RESTRICTED PAGE</div>;
    }

    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {sessionUserJson.name}
                </Title>
                <Title order={5} fw={500}>
                    Published Articles
                </Title>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"my-articles"}
                id={id}
                sessionProfileRelation={"self"}
            />
            <MediaQuery
                smallerThan="sm"
                styles={{ paddingleft: "0px", paddingRight: "0px" }}
            >
                <Container pt="md" c="dimmed">
                    <Title p="md">All Articles</Title>
                    {isLoading || isFetching ? (
                        <Group grow>
                            <DraftsTableSkeleton />
                            <DraftsTableSkeleton />
                            <DraftsTableSkeleton />
                            <DraftsTableSkeleton />
                        </Group>
                    ) : (
                        <>
                            {data ? (
                                <Paper p="sm" withBorder>
                                    <div
                                        style={{
                                            overflowX: "auto",
                                        }}
                                    >
                                        <Table
                                            striped
                                            highlightOnHover
                                            withBorder
                                            bg="white"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Date</th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </Table>
                                    </div>
                                    <Pagination
                                        page={page}
                                        mt="md"
                                        onChange={setPage}
                                        total={
                                            data.data.data.pagination.pageCount
                                        }
                                        siblings={1}
                                        initialPage={1}
                                        position="center"
                                    />
                                </Paper>
                            ) : (
                                <>no data available</>
                            )}
                        </>
                    )}
                    <Title p="md" c="dimmed">
                        Start New
                    </Title>
                    <Paper withBorder p="md">
                        <Stack spacing="1">
                            <TextInput
                                label="Title"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.currentTarget.value)
                                }
                            />
                            <Textarea
                                label="Description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.currentTarget.value)
                                }
                            />

                            <Select
                                label="Location"
                                placeholder="Pick one"
                                icon={<IconLocation size={19} />}
                                itemComponent={SelectItem}
                                description="Location of the event"
                                data={citiesData}
                                searchable
                                maxDropdownHeight={300}
                                nothingFound="Nothing found"
                                filter={(value, item) =>
                                    item.label
                                        .toLowerCase()
                                        .includes(value.toLowerCase().trim()) ||
                                    item.description
                                        .toLowerCase()
                                        .includes(value.toLowerCase().trim())
                                }
                                value={location}
                                onChange={setLocation}
                            />
                            <DatePicker
                                placeholder="Pick date of the event"
                                label="Date"
                                icon={<IconCalendarEvent size={19} />}
                                value={date}
                                onChange={setDate}
                            />
                            <Button
                                mt="md"
                                loading={
                                    isLoadingStartNew || isFetchingStartNew
                                }
                                onClick={handleStartNew}
                            >
                                Start Article
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </MediaQuery>
            <Modal
                opened={takeDownModal}
                onClose={() => setTakeDownModal(false)}
                title="Take Down Article?"
            >
                <Group grow>
                    <Button>Cancel</Button>
                    <Button
                        color="red"
                        loading={isLoadingTakeDown || isFetchingTakeDown}
                        onClick={() => {
                            refetchTakeDown();
                        }}
                    >
                        Take Down
                    </Button>
                </Group>
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

    //fetch session user
    console.log("articles", context.query.id);
    await dbConnect();

    const sessionUser = await Users.findOne({ email: session.user.email });
    const sessionUserJson = JSON.parse(JSON.stringify(sessionUser));

    return {
        props: {
            session,
            sessionUserJson,
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
