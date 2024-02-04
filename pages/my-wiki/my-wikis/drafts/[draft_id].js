import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import dbConnect from "../../../../lib/dbConnect";
import Wikidrafts from "../../../../models/Wikidrafts";
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
} from "@tabler/icons";

export default function WikiDraftEditPage({ sessionUserJson, wikidraftJson }) {
    const router = useRouter();

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    const [savedAlert, setSavedAlert] = useState(false);
    const [publishClicked, setPublishClicked] = useState(false);
    const [title, setTitle] = useState(
        wikidraftJson ? wikidraftJson.title : ""
    );
    const [description, setDescription] = useState(
        wikidraftJson ? wikidraftJson.description : ""
    );
    const [coverImgUrl, setCoverImgUrl] = useState(
        wikidraftJson
            ? wikidraftJson.coverImage
            : "https://png.pngtree.com/element_our/20190522/ourlarge/pngtree-open-book-illustration-image_1072047.jpg"
    );
    let t = "";
    if (wikidraftJson && wikidraftJson.tag === "gen") {
        t = "gen";
    } else if (wikidraftJson && wikidraftJson.tag === "his") {
        t = "his";
    }
    const [tagValue, setTagValue] = useState(wikidraftJson.tag);

    const {
        isLoading: isLoadingSave,
        isFetching: isFetchingSave,
        data: dataSave,
        refetch: refetchSave,
        isError: isErrorSave,
        error: errorSave,
    } = useQuery({
        queryKey: "save_wiki_draft",
        queryFn: () => {
            const bod = {
                title: title,
                description: description,
                content: editorRef.current.getContent(),
                //isPublished: true,
                tag: tagValue,
                coverImage: coverImgUrl,
            };
            return axios.put(`/api/wiki-drafts/${wikidraftJson._id}`, bod);
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
        queryKey: "publish_wiki",
        queryFn: () => {
            //title field
            //description text field
            const bod = {
                authorId: sessionUserJson._id,
                authorName: sessionUserJson.name,
                draftId: wikidraftJson._id,
                title: title,
                description: description,
                content: editorRef.current.getContent(),
                isPublished: true,
                tag: tagValue,
                coverImage: coverImgUrl,
            };

            console.log("boddd", bod);

            return axios.post(
                `/api/wiki-drafts/publish/${wikidraftJson._id}`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("published ", d.data.data);
            setSavedAlert(true);
        },
    });

    const handleDraftSave = () => {
        refetchSave();
    };

    const handlePublish = () => {
        setPublishClicked(true);
        refetchSave();
    };

    if (!wikidraftJson) {
        return <div>DRAFT DOESN&apos;T EXIST</div>;
    }

    if (sessionUserJson._id !== wikidraftJson.authorId) {
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
                    Wiki Page Draft
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

                            <NativeSelect
                                value={tagValue}
                                onChange={(event) =>
                                    setTagValue(event.currentTarget.value)
                                }
                                data={[
                                    { value: "hero", label: "A Hero" },
                                    { value: "martyr", label: "A Martyr" },
                                    {
                                        value: "public_figure",
                                        label: "A Public Figure",
                                    },
                                    { value: "artefact", label: "An Artefact" },
                                    { value: "heritage", label: "Heritage" },
                                ]}
                                label="Type "
                                // /description="Select the type of event"
                                withAsterisk
                            />
                        </Stack>
                    </Paper>
                    <Editor
                        tinymceScriptSrc="/tinymce/tinymce.min.js"
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={wikidraftJson.content}
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
    await dbConnect();

    const sessionUserPromise = Users.findOne({ email: session.user.email });
    const wikidraftPromise = Wikidrafts.findById(context.query.draft_id);
    const [sessionUser, wikidraft] = await Promise.all([
        sessionUserPromise,
        wikidraftPromise,
    ]);
    const sessionUserJson = JSON.parse(JSON.stringify(sessionUser));
    const wikidraftJson = JSON.parse(JSON.stringify(wikidraft));

    return {
        props: {
            session,
            sessionUserJson,
            wikidraftJson,
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
