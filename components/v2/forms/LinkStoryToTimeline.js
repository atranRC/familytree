import {
    Alert,
    Box,
    Button,
    Checkbox,
    Group,
    Paper,
    Stack,
    TextInput,
} from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons";
import axios from "axios";
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { ProfilePageNotificationContext } from "../../../contexts/profilePageContexts";
const ObjectId = require("mongoose").Types.ObjectId;

const checkObjectId = (id) => {
    //const id = new URLSearchParams(url.split("?")[1]).get("articleId");

    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) return true;
        return false;
    }
    return false;
};

export default function LinkStoryToTimeline({
    onCancel,
    story,
    sessionUserId,
}) {
    const profilePageNotification = useContext(ProfilePageNotificationContext);
    const [inputUrl, setInputUrl] = useState("");
    const [inputUrlError, setInputUrlError] = useState(false);
    const [annonChecked, setAnnonChecked] = useState(false);
    const [linkIsValid, setLinkIsValid] = useState(false);

    const addLinkMutate = useMutation({
        mutationFn: async (id) => {
            const url = "/api/article-shared-written-stories";
            const body = {
                articleId: id,
                uploaderId: sessionUserId,
                profileId: story.userId,
                writtenStoryId: story._id,
                userName: story.userName,
                title: story.title,
                content: story.content,
                isAnnon: annonChecked,
            };
            return axios.post(url, body);
        },
        onSuccess: (resp) => {
            //setShowSuccessAlert(true);
            profilePageNotification[0]("Story shared successfully");
            setInputUrl("");
        },
        onError: (err) => {
            profilePageNotification[1]("Could not share story");
            //setShowErrorAlert(true);
        },
    });

    const checkLink = (e) => {
        const id = new URLSearchParams(e.split("?")[1]).get("articleId");
        if (checkObjectId(id)) {
            setLinkIsValid(true);
        } else {
            setLinkIsValid(false);
        }
    };

    const handleLinkStory = () => {
        const id = new URLSearchParams(inputUrl.split("?")[1]).get("articleId");
        if (checkObjectId(id)) {
            addLinkMutate.mutate(id);
            //profilePageNotification[0](id);
        } else {
            profilePageNotification[0]("please enter a valid link");
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: linkIsValid ? "#7950F2" : "gray",
                padding: "5px",
                borderRadius: "1.5rem",
            }}
        >
            <Paper p="md" m="sm" withBorder radius={"1.5em"}>
                <Stack>
                    <TextInput
                        placeholder="Article URL"
                        value={inputUrl}
                        onChange={(e) => {
                            setInputUrl(e.currentTarget.value);
                            checkLink(e.currentTarget.value);
                        }}
                        description="link to the timeline article you would like to share this story to"
                        label="Link to Article"
                        error={inputUrlError && "please enter article url"}
                        onFocus={() => setInputUrlError(false)}
                        withAsterisk
                    />
                    <Checkbox
                        checked={annonChecked}
                        onChange={(event) =>
                            setAnnonChecked(event.currentTarget.checked)
                        }
                        label="Post annonymously"
                    />
                    <Group grow>
                        <Button
                            onClick={handleLinkStory}
                            loading={addLinkMutate.isLoading}
                            radius={"1.5em"}
                            disabled={!linkIsValid}
                        >
                            Add
                        </Button>
                        <Button
                            color="gray"
                            onClick={onCancel}
                            disabled={addLinkMutate.isLoading}
                            radius={"1.5em"}
                        >
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Box>
    );
}
