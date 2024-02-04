import {
    Button,
    Group,
    Select,
    Stack,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
    IconBoxAlignTop,
    IconChevronLeft,
    IconCircleCheck,
    IconDeviceFloppy,
    IconPencil,
} from "@tabler/icons";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";

import { useStyles } from "./AudioStoryEditorStyles";
import { useMutation } from "react-query";
import axios from "axios";

export default function AudioStoryEditor({
    story,
    onSaveSuccess,
    onSaveError,
    onReturn,
}) {
    const [locationError, setLocationError] = useState(false);
    const form = useForm({
        initialValues: {
            title: story.title || "",
            description: story.description || "",
            location: story.location || null,
        },

        validate: {
            title: (value) =>
                value < 2 || value.length > 40 ? "Invalid title" : null,
            description: (value) =>
                value.length > 1000 ? "Invalid description" : null,
        },
    });
    const { classes } = useStyles();
    //{JSON.stringify(form.values)}
    const editStoryMutation = useMutation({
        mutationFn: (bod) => {
            return axios.put(
                `/api/audio-stories/${story._id.toString()}`,
                form.values
            );
        },
        onSuccess: (res) => {
            onSaveSuccess();
        },
        onError: () => {
            onSaveError();
        },
    });
    if (!story) return <div>error</div>;
    return (
        <div className={classes.cont}>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    Story Title
                </Title>

                <TextInput
                    icon={<IconBoxAlignTop />}
                    radius="1.5em"
                    {...form.getInputProps("title")}
                />
            </Stack>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    Story Description
                </Title>
                <Textarea
                    autosize
                    minRows={6}
                    maxRows={15}
                    icon={<IconPencil />}
                    radius="1.5em"
                    {...form.getInputProps("description")}
                />
            </Stack>
            <Group grow align="flex-start">
                <Stack spacing={3}>
                    <Title order={3} align="center" color="dimmed">
                        Story Location
                    </Title>
                    <LocationAutocompleteV2
                        defaultValue={form.values["location"]?.value || ""}
                        setSelectedLocation={(locObj) =>
                            form.setFieldValue("location", locObj)
                        }
                        locationError={locationError}
                        setLocationError={setLocationError}
                        label=""
                        desc=""
                        id="audio_story_editor_location"
                    />
                </Stack>
            </Group>
            <Group align="center" grow p="lg">
                <Button
                    radius="1.5em"
                    color="green"
                    leftIcon={<IconDeviceFloppy />}
                    onClick={() => editStoryMutation.mutate()}
                    loading={editStoryMutation.isLoading}
                >
                    Save
                </Button>
                <Button
                    radius="1.5em"
                    color="gray"
                    leftIcon={<IconChevronLeft />}
                    onClick={() => onReturn()}
                >
                    Back to Story
                </Button>
            </Group>
        </div>
    );
}
