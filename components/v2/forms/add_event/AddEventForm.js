import { useContext, useState } from "react";
/*import {
    ProfilePageNotificationContext,
    ProfilePageProfileContext,
} from "../../../../pages/profiles/[id]/[view]";*/
import { useStyles } from "./AddEventFormStyles";
import { useMutation } from "react-query";
import axios from "axios";
import {
    Button,
    Group,
    Select,
    Stack,
    Text,
    Textarea,
    Title,
} from "@mantine/core";
import {
    IconCalendarEvent,
    IconDeviceFloppy,
    IconPencil,
    IconTimelineEvent,
} from "@tabler/icons";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { events_list, get_auto_title } from "../../../../lib/static_lists";
import moment from "moment";
import { useRouter } from "next/router";
import { EventsQueryContext } from "../../page_comps/events/EventsPageComp";
import {
    ProfilePageNotificationContext,
    ProfilePageProfileContext,
} from "../../../../contexts/profilePageContexts";

//type
//description, location, eventDate,
export default function AddEventForm({ onViewModeChange = () => {} }) {
    const router = useRouter();

    const eventsQueryRefetchContext = useContext(EventsQueryContext);
    const profileQueryContext = useContext(ProfilePageProfileContext);
    const profilePageNotification = useContext(ProfilePageNotificationContext);

    const [locationError, setLocationError] = useState(false);
    const form = useForm({
        initialValues: {
            userId: profileQueryContext._id,
            userName: profileQueryContext.name,
            type: "",
            description: "",
            location: null,
            eventDate: "",
        },

        validate: {
            type: (value) =>
                value === "" || value.length > 40 ? "Invalid input" : null,
            description: (value) =>
                value.length > 500 ? "Invalid description" : null,
        },
    });
    const { classes } = useStyles({
        isValid:
            !!form.values.type &&
            !!form.values.eventDate &&
            !!form.values.location,
    });
    //{JSON.stringify(form.values)}
    const addEventMutation = useMutation({
        mutationFn: () => {
            return axios.post(`/api/events/`, form.values);
        },
        onSuccess: (res) => {
            profilePageNotification[0]("Event added successfully");
            form.reset();
            eventsQueryRefetchContext();
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
            profilePageNotification[1]("Error adding event");
        },
    });

    return (
        <div className={classes.cont}>
            {/*<Text
                fz={24}
                fw={200}
                sx={{ fontFamily: "Lora, serif" }}
                align="center"
                c="dimmed"
            >
                {get_auto_title(
                    form.values["type"],
                    profileQueryContext?.name,
                    form.values?.location?.value,
                    form.values?.eventDate ? (
                        moment(form.values?.eventDate?.value).format(
                            "YYYY-MM-DD"
                        )
                    ) : (
                        <>-</>
                    )
                )}
            </Text>*/}

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
                        //defaultValue={form.values["location"]?.value || ""}
                        setSelectedLocation={(locObj) =>
                            form.setFieldValue("location", locObj)
                        }
                        locationError={locationError}
                        setLocationError={setLocationError}
                        label=""
                        desc=""
                        id="event_add_location"
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

            <Button
                radius="1.5em"
                color="green"
                leftIcon={<IconDeviceFloppy />}
                onClick={() => addEventMutation.mutate()}
                loading={addEventMutation.isLoading}
                disabled={
                    !(
                        !!form.values.type &&
                        !!form.values.eventDate &&
                        !!form.values.location
                    )
                }
            >
                Save
            </Button>
        </div>
    );
}
