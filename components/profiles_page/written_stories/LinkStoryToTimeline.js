import { Alert, Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
const ObjectId = require("mongoose").Types.ObjectId;

const checkObjectId = (id) => {
    //const id = new URLSearchParams(url.split("?")[1]).get("articleId");

    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) return true;
        return false;
    }
    return false;
};

export default function LinkStoryToTimeline({ setShowTimelineLink, story }) {
    const [inputUrl, setInputUrl] = useState("");
    const [inputUrlError, setInputUrlError] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const addLinkMutate = useMutation({
        mutationFn: async (id) => {
            console.log("this be id", id);
            const url = "/api/article-shared-written-stories";
            const body = {
                articleId: id,
                writtenStoryId: story._id,
                userName: story.userName,
            };
            return axios.post(url, body);
        },
        onSuccess: (resp) => {
            setShowSuccessAlert(true);
            setInputUrl("");
        },
        onError: (err) => {
            setShowErrorAlert(true);
        },
    });

    const handleLinkStory = () => {
        if (inputUrl !== "") {
            const id = new URLSearchParams(inputUrl.split("?")[1]).get(
                "articleId"
            );
            if (checkObjectId(id)) {
                addLinkMutate.mutate(id);
                console.log("is id");
            } else {
                console.log("is not id");
            }
        } else {
            setInputUrlError(true);
            console.log("please enter id");
        }
    };

    return (
        <Paper p="md" m="sm" withBorder>
            <Stack>
                {showErrorAlert && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Error!"
                        color="red"
                        withCloseButton
                        closeButtonLabel="X"
                        onClose={() => setShowErrorAlert(false)}
                    >
                        Could not add story to timeline
                    </Alert>
                )}
                {showSuccessAlert && (
                    <Alert
                        icon={<IconCheck size={16} />}
                        title="Success!"
                        color="lightgreen"
                        withCloseButton
                        closeButtonLabel="X"
                        onClose={() => setShowSuccessAlert(false)}
                    >
                        Story successfully added
                    </Alert>
                )}
                <TextInput
                    placeholder="Article URL"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.currentTarget.value)}
                    description="link to the timeline article you would like to share this story to"
                    label="Link to Article"
                    error={inputUrlError && "please enter article url"}
                    onFocus={() => setInputUrlError(false)}
                    withAsterisk
                />
                <Group grow>
                    <Button
                        onClick={handleLinkStory}
                        loading={addLinkMutate.isLoading}
                    >
                        Add
                    </Button>
                    <Button
                        color="red"
                        onClick={() => {
                            setShowTimelineLink(false);
                        }}
                        disabled={addLinkMutate.isLoading}
                    >
                        Cancel
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}
