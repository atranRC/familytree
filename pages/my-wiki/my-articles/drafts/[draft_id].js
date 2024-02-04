import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import dbConnect from "../../../../lib/dbConnect";
import Articledrafts from "../../../../models/Articledrafts";
import Users from "../../../../models/Users";
import { authOptions } from "../../../api/auth/[...nextauth]";
import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import AppShellContainer from "../../../../components/appShell";
import { ProfileTitleSection } from "../../../../components/titleSections";
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
    Box,
    Divider,
} from "@mantine/core";
import SecondaryNavbar from "../../../../components/profiles_page/SecondaryNavbar";
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
import LocationAutocomplete from "../../../../components/location/LocationAutocomplete";
import LocationAutocompleteV2 from "../../../../components/v2/location/location_autocomplete/LocationAutoCompleteV2";
import { useForm } from "@mantine/form";
import moment from "moment";

export default function DraftEditPage({ sessionUserJson, articledraftJson }) {
    const router = useRouter();
    const id = router.query.id;

    const form = useForm({
        initialValues: {
            title: articledraftJson?.title || "",
            description: articledraftJson?.description || "",
            //content: articledraftJson?.content,
            location: articledraftJson?.location || null,
            date: articledraftJson?.date
                ? moment(articledraftJson?.date.toString())._d
                : "",
            tag: articledraftJson?.tag || "",
            coverImage: articledraftJson?.coverImage,
        },

        validate: {
            title: (value) =>
                value === "" || value.length > 40 ? "Invalid input" : null,
            description: (value) =>
                value === "" || value.length > 200
                    ? "Invalid description"
                    : null,
            location: (value) => (value === null ? "Invalid location" : null),
            date: (value) => (value === null ? "Invalid date" : null),
        },
    });

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    const [savedAlert, setSavedAlert] = useState(false);
    const [publishClicked, setPublishClicked] = useState(false);

    const [locationError, setLocationError] = useState(false);

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
                ...form.values,
                content: editorRef.current.getContent(),
            };
            console.log("save body", bod);
            return axios.put(
                `/api/article-drafts/${articledraftJson._id}`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            if (publishClicked) {
                //console.log("piblish clicked??", publishClicked);
                setPublishClicked(false);
                refetchPublish();
            }
            //console.log("draft saved ", d.data.data);
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
                ...form.values,
                content: editorRef.current.getContent(),
                draftId: articledraftJson._id,
                isPublished: true,
            };

            console.log("publish boddd", bod);

            return axios.post(
                `/api/article-drafts/publish/${articledraftJson._id}`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("published ", d.data.data);
            setSavedAlert(true);
        },
    });

    const handleDraftSave = () => {
        form.validate();
        if (form.isValid()) {
            //console.log("validated values save", form.values);
            refetchSave();
            //console.log("publish clicked", publishClicked);
        }
    };

    const handlePublish = () => {
        form.validate();
        if (form.isValid()) {
            //console.log("validated values publish", form.values);
            setPublishClicked(true);
            refetchSave();
            //console.log("publish clicked", publishClicked);
        }
    };

    if (!articledraftJson) {
        return <div>DRAFT DOESN&apos;T EXIST</div>;
    }

    if (sessionUserJson._id !== articledraftJson.authorId) {
        return <div>RESTRICTED PAGE</div>;
    }

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
                    Drafts
                </Title>
            </ProfileTitleSection>

            <MediaQuery
                smallerThan="sm"
                styles={{ paddingleft: "0px", paddingRight: "0px" }}
            >
                <Container size="xl" mt="md">
                    <Paper withBorder my="md" p="md">
                        <Stack>
                            <TextInput
                                label="Title"
                                {...form.getInputProps("title")}
                            />
                            <Textarea
                                label="Description"
                                {...form.getInputProps("description")}
                            />
                            <Textarea
                                label="Cover Image URL"
                                {...form.getInputProps("coverImage")}
                            />
                            <Select
                                data={[
                                    {
                                        value: "gen",
                                        label: "Tigray Genocide",
                                    },
                                    {
                                        value: "his",
                                        label: "Tigray History",
                                    },
                                ]}
                                value={form.values["tag"]}
                                onChange={(e) => form.setFieldValue("tag", e)}
                                placeholder="Pick an Event"
                                radius="1.5em"
                                icon={<IconCalendarEvent />}
                                label="Type"
                            />

                            <LocationAutocompleteV2
                                //defaultValue={form.values["location"]?.value || ""}
                                defaultValue={
                                    form.values["location"]?.value || ""
                                }
                                setSelectedLocation={(locObj) =>
                                    form.setFieldValue("location", locObj)
                                }
                                locationError={locationError}
                                setLocationError={setLocationError}
                                label="Location"
                                desc="Type a location and select from the options below."
                                id="draft-article"
                            />
                            <DatePicker
                                placeholder="Pick date of the event"
                                label="Date"
                                icon={<IconCalendarEvent size={19} />}
                                /*value={date}
                onChange={setDate}
                error={dateError && "please enter date"}
                onFocus={() => setDateError(false)}*/
                                {...form.getInputProps("date")}
                            />
                        </Stack>
                    </Paper>
                    <Editor
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={articledraftJson?.content}
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
                                "table",
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic forecolor underline | alignleft aligncenter " +
                                "alignright alignjustify | bullist numlist outdent indent | " +
                                "removeformat | backcolor | help" +
                                " link unlink anchor preview image |" +
                                " table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
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
            {/*errorSelectedLocation && (
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
        )*/}
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
