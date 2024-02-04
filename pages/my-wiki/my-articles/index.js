import {
    ActionIcon,
    Badge,
    Button,
    Container,
    Divider,
    Group,
    MediaQuery,
    Modal,
    NativeSelect,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
    Textarea,
    Title,
    createStyles,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconCalendarEvent, IconTrash } from "@tabler/icons";
import axios from "axios";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../components/appShell";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";

import LocationAutocomplete from "../../../components/location/LocationAutocomplete";
import { DraftsTableSkeleton } from "../../../components/profiles_page/my_articles_page/cards";
import { ProfileTitleSection } from "../../../components/titleSections";

import dbConnect from "../../../lib/dbConnect";
import Users from "../../../models/Users";
import { authOptions } from "../../api/auth/[...nextauth]";
import LocationAutocompleteV2 from "../../../components/v2/location/location_autocomplete/LocationAutoCompleteV2";
import AddArticleForm from "../../../components/v2/forms/add_article/AddArticleForm";

export default function MyArticlesPage({ sessionUserJson }) {
    const router = useRouter();

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

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [articleToTakeDown, setArticleToTakeDown] = useState("");
    const [takeDownModal, setTakeDownModal] = useState(false);

    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(false);
    const [description, setDescription] = useState("");
    const [descriptionError, setDescriptionError] = useState(false);
    const [date, setDate] = useState("");
    const [dateError, setDateError] = useState(false);
    const [tagValue, setTagValue] = useState("");
    const [tagValueError, setTagValueError] = useState(false);
    const [coverImgUrl, setCoverImgUrl] = useState(
        "https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg"
    );
    const [coverImgError, setCoverImageError] = useState(false);

    const [selectedLocation, setSelectedLocation] = useState();
    const [locationError, setLocationError] = useState(false);

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
        refetchOnWindowFocus: false,
        queryFn: () => {
            const bod = {
                authorId: sessionUserJson._id,
                authorName: sessionUserJson.name,
                articleId: null,
                title: title,
                description: description,
                content: "Start here...",
                location: {
                    value: selectedLocation.value,
                    lon: selectedLocation.lon
                        ? selectedLocation.lon
                        : "39.476826",
                    lat: selectedLocation.lat
                        ? selectedLocation.lat
                        : "13.496664",
                },
                date: date,
                tag: tagValue,
                coverImage: coverImgUrl,
            };
            return axios.post("/api/article-drafts/", bod);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("created ", d.data.data);
            router.push(
                `/profiles/${sessionUserJson._id}/my-articles/drafts/${d.data.data._id}`
            );
        },
    });

    /*const {
        isLoading: isLoadingLocations,
        isFetching: isFetchingLocations,
        data: dataLocations,
        refetch: refetchLocations,
        isError: isErrorLocations,
        error: errorLocations,
    } = useQuery({
        queryKey: "fetch-locations",
        queryFn: () => {
            return axios.get(
                `https://nominatim.openstreetmap.org/search?q=${locationInputValue}&format=json`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            const cit = d.data.map((d) => {
                return {
                    value: d.display_name,
                    lat: d.lat,
                    lon: d.lon,
                };
            });
            setFetchedLocations(cit);
        },
    });*/

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
                                    `/my-wiki/my-articles/drafts/${r.draftId}`
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
        if (
            !selectedLocation ||
            title === "" ||
            description === "" ||
            tagValue === "" ||
            date === "" ||
            coverImgUrl === ""
        ) {
            !selectedLocation && setLocationError(true);
            title === "" && setTitleError(true);
            description === "" && setDescriptionError(true);
            tagValue === "" && setTagValueError(true);
            date === "" && setDateError(true);
            coverImgUrl === "" && setCoverImageError(true);
        } else {
            refetchStartNew();
        }

        //console.log("start new", title, description, location, date);
    };

    /*const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };*/

    useEffect(() => {
        if (data) {
            setPageCount(data.data.data.pagination.pageCount);
        }
    }, [data]);

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [page, refetch]);

    /*useEffect(() => {
        function refetchLocationsFun() {
            refetchLocations();
        }
        if (locationInputValue !== "") {
            refetchLocationsFun();
        }
    }, [locationInputValue, refetchLocations]);*/
    if (!sessionUserJson.isHistorian) {
        return <div>restrincted page</div>;
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
                    {/*<Paper withBorder p="md">
                    <Stack spacing="1">
                            <TextInput
                                label="Title"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.currentTarget.value)
                                }
                                error={titleError && "please enter title"}
                                onFocus={() => setTitleError(false)}
                            />
                            <Textarea
                                label="Description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.currentTarget.value)
                                }
                                error={
                                    descriptionError &&
                                    "please enter description"
                                }
                                onFocus={() => setDescriptionError(false)}
                            />
                            <Textarea
                                label="Cover Image URL"
                                value={coverImgUrl}
                                onChange={(event) =>
                                    setCoverImgUrl(event.currentTarget.value)
                                }
                                error={
                                    coverImgError &&
                                    "please enter cover image url"
                                }
                                onFocus={() => setCoverImageError(false)}
                            />
                            <NativeSelect
                                value={tagValue}
                                onChange={(event) =>
                                    setTagValue(event.currentTarget.value)
                                }
                                data={[
                                    { value: "", label: "Select..." },
                                    { value: "gen", label: "Gen" },
                                    { value: "his", label: "History" },
                                ]}
                                label="Type "
                                // /description="Select the type of event"
                                withAsterisk
                                error={tagValueError && "please enter type"}
                                onFocus={() => setTagValueError(false)}
                            />
                            <Autocomplete
                                label="Location"
                                value={locationInputValue}
                                onChange={setLocationInputValue}
                                data={fetchedLocations}
                                onItemSubmit={handleLocationSelect}
                            />
                            <LocationAutocomplete
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                                locationError={locationError}
                                setLocationError={setLocationError}
                                id="new-article"
                            />

                            <LocationAutocompleteV2
                                //defaultValue={form.values["location"]?.value || ""}
                                setSelectedLocation={(locObj) =>
                                    setSelectedLocation(locObj)
                                }
                                locationError={locationError}
                                setLocationError={setLocationError}
                                label=""
                                desc=""
                                id="new-article"
                            />
                            <DatePicker
                                placeholder="Pick date of the event"
                                label="Date"
                                icon={<IconCalendarEvent size={19} />}
                                value={date}
                                onChange={setDate}
                                error={dateError && "please enter date"}
                                onFocus={() => setDateError(false)}
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
                            </Paper>*/}
                    <AddArticleForm />
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
