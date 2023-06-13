import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import dbConnect from "../../../../../lib/dbConnect";
import Articledrafts from "../../../../../models/Articledrafts";
import Users from "../../../../../models/Users";
import { authOptions } from "../../../../api/auth/[...nextauth]";
import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import AppShellContainer from "../../../../../components/appShell";
import { ProfileTitleSection } from "../../../../../components/titleSections";
import {
    Alert,
    Avatar,
    Button,
    Container,
    Group,
    MediaQuery,
    Paper,
    Select,
    Stack,
    Textarea,
    TextInput,
    Title,
    Text,
    Autocomplete,
    NativeSelect,
} from "@mantine/core";
import SecondaryNavbar from "../../../../../components/profiles_page/SecondaryNavbar";
import { useQuery } from "react-query";
import axios from "axios";
import {
    IconAlertCircle,
    IconBroadcast,
    IconCalendarEvent,
    IconDeviceFloppy,
    IconFile,
    IconLocation,
} from "@tabler/icons";
import { DatePicker } from "@mantine/dates";

export default function DraftEditPage({ sessionUserJson, articledraftJson }) {
    const router = useRouter();
    const id = router.query.id;

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    const [savedAlert, setSavedAlert] = useState(false);
    const [publishClicked, setPublishClicked] = useState(false);
    const [title, setTitle] = useState(
        articledraftJson ? articledraftJson.title : ""
    );
    const [description, setDescription] = useState(
        articledraftJson ? articledraftJson.description : ""
    );
    const [coverImgUrl, setCoverImgUrl] = useState(
        articledraftJson
            ? articledraftJson.coverImage
            : "https://static.remove.bg/sample-gallery/graphics/bird-thumbnail.jpg"
    );

    const [location, setLocation] = useState(
        articledraftJson ? articledraftJson.location : null
    );
    const [date, setDate] = useState(
        articledraftJson ? articledraftJson.date : ""
    );
    const [locationInputValue, setLocationInputValue] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [errorSelectedLocation, setErrorSelectedLocation] = useState(false);
    const [fetchedLocations, setFetchedLocations] = useState([]);
    let t = "";
    if (articledraftJson && articledraftJson.tag === "gen") {
        t = "gen";
    } else if (articledraftJson && articledraftJson.tag === "his") {
        t = "his";
    }
    const [tagValue, setTagValue] = useState(articledraftJson.tag);

    const {
        isLoading: isLoadingSave,
        isFetching: isFetchingSave,
        data: dataSave,
        refetch: refetchSave,
        isError: isErrorSave,
        error: errorSave,
    } = useQuery({
        queryKey: "save-draft",
        queryFn: () => {
            const bod = {
                title: title,
                description: description,
                content: editorRef.current.getContent(),
                location: selectedLocation,
                date: date.toString(),
                tag: tagValue,
                coverImage: coverImgUrl,
            };
            return axios.put(
                `/api/article-drafts/${articledraftJson._id}`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            if (publishClicked) {
                console.log("publishhhhh", publishClicked);
                setPublishClicked(false);
                refetchPublish();
            }
            console.log("draft saved ", d.data.data);
            setSavedAlert(true);
        },
    });

    const {
        isLoading: isLoadingPublish,
        isFetching: isFetchingPublish,
        data: dataPublish,
        refetch: refetchPublish,
        isError: isErrorPublish,
        error: errorPublish,
    } = useQuery({
        queryKey: "publish",
        queryFn: () => {
            //title field
            //description text field
            //location field
            //date field
            const bod = {
                authorId: sessionUserJson._id,
                authorName: sessionUserJson.name,
                draftId: articledraftJson._id,
                title: title,
                description: description,
                content: editorRef.current.getContent(),
                location: selectedLocation,
                date: date,
                isPublished: true,
                tag: tagValue,
                coverImage: coverImgUrl,
            };

            console.log("boddd", bod);

            return axios.post(
                `/api/article-drafts/publish/${articledraftJson._id}`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("published ", d.data.data);
            setSavedAlert(true);
        },
    });

    const {
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
    });

    const handleLocationSelect = (l) => {
        console.log(l);
        setSelectedLocation(l);
    };

    const handleDraftSave = () => {
        if (selectedLocation) {
            refetchSave();
        } else {
            setErrorSelectedLocation(true);
        }
    };

    const handlePublish = () => {
        if (selectedLocation) {
            console.log("date", date);
            setPublishClicked(true);
            refetchSave();
        } else {
            setErrorSelectedLocation(true);
        }
    };

    useEffect(() => {
        function refetchLocationsFun() {
            refetchLocations();
        }
        if (locationInputValue !== "") {
            refetchLocationsFun();
        }
    }, [locationInputValue]);

    if (!articledraftJson) {
        return <div>DRAFT DOESN&apos;T EXIST</div>;
    }

    if (sessionUserJson._id !== articledraftJson.authorId) {
        return <div>RESTRICTED PAGE</div>;
    }
    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {sessionUserJson.name}
                </Title>
                <Title order={5} fw={500}>
                    Drafts
                </Title>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"drafts"}
                id={id}
                sessionProfileRelation={"self"}
            />
            <MediaQuery
                smallerThan="sm"
                styles={{ paddingleft: "0px", paddingRight: "0px" }}
            >
                <Container size="xl" mt="md">
                    <Paper withBorder my="md" p="md">
                        <Stack>
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

                            <Textarea
                                label="Cover Image URL"
                                value={coverImgUrl}
                                onChange={(event) =>
                                    setCoverImgUrl(event.currentTarget.value)
                                }
                            />

                            <Autocomplete
                                label="Location"
                                value={locationInputValue}
                                onChange={setLocationInputValue}
                                data={fetchedLocations}
                                onItemSubmit={handleLocationSelect}
                                error={
                                    errorSelectedLocation && "invalid location"
                                }
                            />
                            <NativeSelect
                                value={tagValue}
                                onChange={(event) =>
                                    setTagValue(event.currentTarget.value)
                                }
                                data={[
                                    { value: "gen", label: "Gen" },
                                    { value: "his", label: "History" },
                                ]}
                                label="Type "
                                // /description="Select the type of event"
                                withAsterisk
                            />
                            <DatePicker
                                placeholder="Pick date of the event"
                                label="Date"
                                icon={<IconCalendarEvent size={19} />}
                                value={date}
                                onChange={setDate}
                            />
                        </Stack>
                    </Paper>
                    <Editor
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={articledraftJson.content}
                        init={{
                            height: "calc(100vh - 2rem)",
                            menubar: false,
                            toolbar_sticky: true,
                            plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "preview",
                                "help",
                                "wordcount",
                                "anchor",
                                "preview",
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic forecolor underline | alignleft aligncenter " +
                                "alignright alignjustify | bullist numlist outdent indent | " +
                                "removeformat | backcolor | help" +
                                " link unlink anchor preview image",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                    />
                </Container>
            </MediaQuery>
            {savedAlert && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Saved"
                    color="green"
                    radius="xl"
                    withCloseButton
                    onClose={() => setSavedAlert(false)}
                >
                    Your draft has been saved!
                </Alert>
            )}
            {errorSelectedLocation && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Saved"
                    color="red"
                    radius="xl"
                    withCloseButton
                    onClose={() => setErrorSelectedLocation(false)}
                >
                    Invalid Inputs. Please check for empty fields.
                </Alert>
            )}
            <Group grow mt="md">
                {/*<button onClick={log}>Log editor content</button>*/}
                <Button
                    leftIcon={<IconDeviceFloppy />}
                    loading={isLoadingSave || isFetchingSave}
                    onClick={handleDraftSave}
                >
                    Save Draft
                </Button>
                <Button
                    leftIcon={<IconBroadcast />}
                    loading={isLoadingPublish || isFetchingPublish}
                    disabled={isLoadingSave || isFetchingSave}
                    onClick={handlePublish}
                    color="green"
                >
                    Publish
                </Button>
            </Group>
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
    console.log("article-drafts", context.query.id, context.query.draft_id);
    await dbConnect();

    const sessionUserPromise = Users.findOne({ email: session.user.email });
    const articledraftPromise = Articledrafts.findById(context.query.draft_id);
    const [sessionUser, articledraft] = await Promise.all([
        sessionUserPromise,
        articledraftPromise,
    ]);
    const sessionUserJson = JSON.parse(JSON.stringify(sessionUser));
    const articledraftJson = JSON.parse(JSON.stringify(articledraft));

    return {
        props: {
            session,
            sessionUserJson,
            articledraftJson,
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
