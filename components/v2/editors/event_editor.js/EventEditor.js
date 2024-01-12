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
import moment from "moment";
import { useState } from "react";
import { events_list } from "../../../../lib/static_lists";
import {
    IconCalendarEvent,
    IconChevronLeft,
    IconCircleCheck,
    IconDeviceFloppy,
    IconPencil,
    IconTimelineEvent,
} from "@tabler/icons";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { DatePicker } from "@mantine/dates";
import { useStyles } from "./EventEditorStyles";
import { useMutation } from "react-query";
import axios from "axios";

export default function EventEditor({
    event,
    onSaveSuccess,
    onSaveError,
    onReturn,
}) {
    const [locationError, setLocationError] = useState(false);
    const form = useForm({
        initialValues: {
            type: event.type || "",
            description: event.description || "",
            location: event.location || null,
            eventDate: event.eventDate
                ? moment(event.eventDate.toString())._d
                : "",
        },

        validate: {
            type: (value) =>
                value === "" || value.length > 40 ? "Invalid input" : null,
            description: (value) =>
                value.length > 500 ? "Invalid description" : null,
        },
    });
    const { classes } = useStyles();
    //{JSON.stringify(form.values)}
    const editEventMutation = useMutation({
        mutationFn: (bod) => {
            return axios.put(
                `/api/events/${event._id.toString()}`,
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
    if (!event) return <div>error</div>;
    return (
        <div className={classes.cont}>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    Event Type
                </Title>
                <Select
                    data={events_list}
                    value={form.values["type"]}
                    onChange={(e) => form.setFieldValue("type", e)}
                    placeholder="Pick an Event"
                    radius="1.5em"
                    icon={<IconCalendarEvent />}
                />
            </Stack>
            <Stack spacing={3}>
                <Title order={3} align="center" color="dimmed">
                    Description
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
                        Event Location
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
                        id="event_editor_location"
                    />
                </Stack>
                <Stack spacing={3}>
                    <Title order={3} align="center" color="dimmed">
                        Event Date
                    </Title>
                    <DatePicker
                        placeholder="Pick date"
                        icon={<IconTimelineEvent />}
                        {...form.getInputProps("eventDate")}
                        radius="1.5em"
                    />
                </Stack>
            </Group>
            <Group align="center" grow p="lg">
                <Button
                    radius="1.5em"
                    color="green"
                    leftIcon={<IconDeviceFloppy />}
                    onClick={() => editEventMutation.mutate()}
                    loading={editEventMutation.isLoading}
                >
                    Save
                </Button>
                <Button
                    radius="1.5em"
                    color="gray"
                    leftIcon={<IconChevronLeft />}
                    onClick={() => onReturn()}
                >
                    Back to Event
                </Button>
            </Group>
        </div>
    );
}
