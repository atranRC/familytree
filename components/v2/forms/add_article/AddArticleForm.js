import {
    Button,
    NativeSelect,
    Paper,
    Select,
    Stack,
    TextInput,
    Textarea,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function AddArticleForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [locationError, setLocationError] = useState(false);
    const form = useForm({
        initialValues: {
            title: "",
            description: "",
            content:
                "This Wiki Article is currently being written, Please check back later.",
            location: null,
            date: "",
            tag: "his",
            coverImage: "/statics/wikibookcover.jpg",
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

    const mutation = useMutation({
        mutationFn: (bod) => {
            return axios.post(`/api/article-drafts/`, bod);
        },
        onSuccess: (res) => {
            form.reset();
            router.push(`/my-wiki/my-articles/drafts/${res.data.data._id}`);
        },
        onError: () => {},
    });

    const handleSubmit = (values) => {
        //console.log("new article form", values);
        mutation.mutate(values);
    };

    if (status === "loading") return <div>loading...</div>;
    return (
        <Paper>
            <Stack>
                <form
                    onSubmit={form.onSubmit((values) => handleSubmit(values))}
                >
                    <TextInput
                        label="Title"
                        /*value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                    error={titleError && "please enter title"}
                    onFocus={() => setTitleError(false)}*/
                        {...form.getInputProps("title")}
                    />
                    <Textarea
                        label="Description"
                        /*value={description}
                    onChange={(event) =>
                        setDescription(event.currentTarget.value)
                    }*/
                        //error={descriptionError && "please enter description"}
                        //onFocus={() => setDescriptionError(false)}
                        {...form.getInputProps("description")}
                    />
                    <Textarea
                        label="Cover Image URL"
                        /*value={coverImgUrl}
                    onChange={(event) =>
                        setCoverImgUrl(event.currentTarget.value)
                    }
                    error={coverImgError && "please enter cover image url"}
                    onFocus={() => setCoverImageError(false)}*/
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
                    {/*<Autocomplete
                                label="Location"
                                value={locationInputValue}
                                onChange={setLocationInputValue}
                                data={fetchedLocations}
                                onItemSubmit={handleLocationSelect}
                            />*/}
                    {/*<LocationAutocomplete
                                selectedLocation={selectedLocation}
                                setSelectedLocation={setSelectedLocation}
                                locationError={locationError}
                                setLocationError={setLocationError}
                                id="new-article"
                            />*/}

                    <LocationAutocompleteV2
                        //defaultValue={form.values["location"]?.value || ""}
                        setSelectedLocation={(locObj) =>
                            form.setFieldValue("location", locObj)
                        }
                        locationError={locationError}
                        setLocationError={setLocationError}
                        label="Location"
                        desc="Type a location and select from the options below."
                        id="new-article"
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
                    <Button
                        mt="md"
                        //loading={isLoadingStartNew || isFetchingStartNew}
                        //onClick={handleStartNew}
                        type="submit"
                        loading={mutation.isLoading}
                    >
                        Start Article
                    </Button>
                </form>
            </Stack>
        </Paper>
    );
}
