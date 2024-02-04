import {
    Button,
    Group,
    Select,
    Stack,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import {
    IconBoxAlignTop,
    IconChevronLeft,
    IconCircleCheck,
    IconDeviceFloppy,
    IconPencil,
} from "@tabler/icons";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { useRouter } from "next/router";
import { WrittenStoriesQueryContext } from "../../page_comps/written_stories/WrittenStoriesPageComp";
import { useContext, useState } from "react";
import { useForm } from "@mantine/form";
import { useStyles } from "./AddWrittenStoryStyles";
import { useMutation } from "react-query";
import axios from "axios";
import {
    ProfilePageNotificationContext,
    ProfilePageProfileContext,
} from "../../../../contexts/profilePageContexts";

export default function AddWrittenStory({ onViewModeChange = () => {} }) {
    const router = useRouter();

    const writtenStoriesQueryRefetchContext = useContext(
        WrittenStoriesQueryContext
    );
    const profileQueryContext = useContext(ProfilePageProfileContext);
    const profilePageNotification = useContext(ProfilePageNotificationContext);

    const [locationError, setLocationError] = useState(false);
    const form = useForm({
        initialValues: {
            userId: profileQueryContext._id,
            userName: profileQueryContext.name,
            title: "",
            content: "",
            location: null,
        },

        validate: {
            title: (value) =>
                value < 2 || value.length > 40 ? "Invalid title" : null,
            content: (value) =>
                value.length > 2000 ? "Invalid content" : null,
        },
    });
    const { classes } = useStyles({
        isValid:
            !!form.values.title &&
            !!form.values.content &&
            !!form.values.location,
    });
    //{JSON.stringify(form.values)}
    const addStoryMutation = useMutation({
        mutationFn: () => {
            return axios.post(`/api/written-stories/`, form.values);
        },
        onSuccess: (res) => {
            profilePageNotification[0]("Story added successfully");
            form.reset();
            writtenStoriesQueryRefetchContext();
            router.push(
                {
                    //...router,
                    query: {
                        ...router.query,
                        contentId: res.data._id.toString(),
                    },
                },
                undefined,
                { shallow: true }
            );
            onViewModeChange("view");
        },
        onError: () => {
            profilePageNotification[1]("Error adding story");
        },
    });
    return (
        <div className={classes.cont}>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    What&apos;s this story about?
                </Title>

                <TextInput
                    icon={<IconBoxAlignTop />}
                    radius="1.5em"
                    {...form.getInputProps("title")}
                />
            </Stack>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    {`Write your story about ${profileQueryContext.name}`}
                </Title>
                <Textarea
                    autosize
                    minRows={6}
                    maxRows={15}
                    icon={<IconPencil />}
                    radius="1.5em"
                    {...form.getInputProps("content")}
                />
            </Stack>
            <Group grow align="flex-start">
                <Stack spacing={3}>
                    <Title order={3} align="center" color="dimmed">
                        Where did this story happen?
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
                        id="written_story_add_location"
                    />
                </Stack>
            </Group>
            <Group align="center" grow p="lg">
                <Button
                    radius="1.5em"
                    color="green"
                    leftIcon={<IconDeviceFloppy />}
                    onClick={() => addStoryMutation.mutate()}
                    loading={addStoryMutation.isLoading}
                    disabled={
                        !(
                            !!form.values.title &&
                            !!form.values.content &&
                            !!form.values.location
                        )
                    }
                >
                    Add Story
                </Button>
            </Group>
        </div>
    );
}
