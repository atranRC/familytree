import {
    Button,
    Radio,
    TextInput,
    Textarea,
    Title,
    createStyles,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { useContext, useState } from "react";
import { IconBallon, IconCoffin, IconWritingSign } from "@tabler/icons";

import {
    ProfileSettingsPageNotificationContext,
    ProfileSettingsPageProfileContext,
    ProfileSettingsPageSessionContext,
} from "../../../../contexts/profileSettingsPageContext";
import { useForm } from "@mantine/form";
import moment from "moment";
import { useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/router";

export const useStyles = createStyles((theme) => ({
    formCont: {
        //height: "100%",
        //width: "70%",
        //maxWidth: "70%",

        //border: "1px solid red",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "1.5em",
        padding: "2em",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            transition: ".2s ease-in-out",
        },
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        /*"@media (max-width: 800px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
            minWidth: "100%",
        },

        "@media (min-width: 1900px)": {
            paddingLeft: "10px",
            paddingRight: "10px",
            width: "30%",
            maxWidth: "30%",
        },*/
        border: "1px solid #E8E8E8",
        borderRadius: "1.5em",
    },
    nameSection: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1em",
    },
    sexSection: {
        display: "flex",
        //flexDirection: "column",
        flexWrap: "wrap",
        //justifyContent: "space-between",
        gap: "1em",
    },
    locationSection: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1em",
    },
    location: {
        flexGrow: 1,
        maxWidth: "50%",
        "@media (max-width: 800px)": {
            //paddingLeft: "10px",
            //paddingRight: "10px",
            minWidth: "100%",
        },
        //flexShrink: 0,
    },
    miscSection: { display: "flex", flexWrap: "wrap", gap: "1em" },
}));

export default function ProfileEditor() {
    const profile = useContext(ProfileSettingsPageProfileContext);
    const notify = useContext(ProfileSettingsPageNotificationContext);
    const session = useContext(ProfileSettingsPageSessionContext);
    const router = useRouter();

    const [birthplaceLocationError, setBirthplaceLocationError] =
        useState(false);
    const [currentResidenceLocationError, setCurrentResidenceLocationError] =
        useState(false);
    const form = useForm({
        initialValues: {
            name: profile.data.name || "",
            fathers_name: profile.data.fathers_name || "",
            last_name: profile.data.last_name || "",
            //sex: profile.data.sex || "",
            birthday: profile.data.birthday
                ? moment(profile.data.birthday.toString())._d
                : "",
            birth_place: profile.data.birth_place || null,
            current_residence: profile.data.current_residence || null,
            nicknames: profile.data.nicknames || "",
            shortBio: profile.data.shortBio || "",

            died: profile.data.died
                ? moment(profile.data.died.toString())._d
                : "",
            //owner: "self",
            /*isHistorian: false,
                isBlocked: false,
            isPrivate: profile.data.isPrivate || false,*/
        },

        validate: {
            name: (value) =>
                value.length < 2 || value.length > 40
                    ? "Please enter a valid name"
                    : null,
        },
    });
    const { classes } = useStyles();

    const userInfoMutation = useMutation({
        mutationFn: (values) => {
            //console.log("body sent", form.values);
            if (profile.data.owner === "self")
                return axios.put(`/api/users/v2/${profile.data._id}`, values);

            return axios.put(
                `/api/users/v2/edit-unclaimed?unclaimedProfileId=${profile.data._id}`,
                values
            );
        },
        onSuccess: (res) => {
            notify.success("your profile information has been updated");
            console.log(notify);
            profile.refetch();
            //console.log("info update stage", res.data);
        },
        onError: () => {
            notify.error("could not update your profile information");
        },
    });

    const handleOnSubmit = (values) => {
        userInfoMutation.mutate(values);
    };

    return (
        <form
            onSubmit={form.onSubmit((values) => handleOnSubmit(values))}
            className={classes.formCont}
        >
            <Title order={1} align="center">
                Profile Informaton
            </Title>
            <div className={classes.nameSection}>
                <TextInput
                    withAsterisk
                    label="Name"
                    description="Your First Name"
                    sx={{ flexGrow: 1 }}
                    //description="Name of this Family Tree"
                    {...form.getInputProps("name")}
                    radius="1.5em"
                    icon={<IconWritingSign />}
                />
                <TextInput
                    label="Father's Name"
                    description="Your Father's Name"
                    //description="Name of this Family Tree"
                    sx={{ flexGrow: 1 }}
                    {...form.getInputProps("fathers_name")}
                    radius="1.5em"
                    icon={<IconWritingSign />}
                />
                <TextInput
                    label="Last Name"
                    description="Your Family Name"
                    //description="Name of this Family Tree"
                    sx={{ flexGrow: 1 }}
                    {...form.getInputProps("last_name")}
                    radius="1.5em"
                    icon={<IconWritingSign />}
                />
            </div>
            <div className={classes.sexSection}>
                <DatePicker
                    placeholder="Pick date"
                    label="Birthday"
                    description="Birthday"
                    /*onChange={(e) => {
                        form.setValues({
                            ...form.values,
                            birthDate: e,
                        });
                    }}*/
                    {...form.getInputProps("birthday")}
                    sx={{ flexGrow: 1 }}
                    radius="1.5em"
                    icon={<IconBallon />}
                />
                <TextInput
                    label="Nicknames"
                    description="Other names you go by"
                    placeholder="nicknames"
                    sx={{ flexGrow: 1 }}
                    {...form.getInputProps("nicknames")}
                    radius="1.5em"
                />
            </div>

            <div className={classes.locationSection}>
                <div className={classes.location}>
                    <LocationAutocompleteV2
                        setSelectedLocation={(loc) =>
                            form.setValues({
                                ...form.values,
                                birth_place: loc,
                            })
                        }
                        defaultValue={form.values?.birth_place?.value || ""}
                        locationError={birthplaceLocationError}
                        setLocationError={setBirthplaceLocationError}
                        label="Birthplace"
                        placeholder="Enter location name"
                        id="birthplace"
                    />
                </div>
                <div className={classes.location}>
                    {profile.data.died ? (
                        <DatePicker
                            placeholder="Pick date"
                            label="Date of Death"
                            description="Date of Death"
                            /*onChange={(e) => {
                        form.setValues({
                            ...form.values,
                            birthDate: e,
                        });
                    }}*/
                            {...form.getInputProps("died")}
                            sx={{ flexGrow: 1 }}
                            radius="1.5em"
                            icon={<IconCoffin />}
                        />
                    ) : (
                        <LocationAutocompleteV2
                            setSelectedLocation={(loc) =>
                                form.setValues({
                                    ...form.values,
                                    current_residence: loc,
                                })
                            }
                            defaultValue={
                                form.values?.current_residence?.value || ""
                            }
                            locationError={currentResidenceLocationError}
                            setLocationError={setCurrentResidenceLocationError}
                            label="Current Residence"
                            placeholder="Enter location name"
                            id="current_residence"
                        />
                    )}
                </div>
            </div>
            <div className={classes.miscSection}>
                <Textarea
                    label="Short Bio"
                    description="say a few words about yourself"
                    placeholder="short bio"
                    sx={{ flexGrow: 1 }}
                    {...form.getInputProps("shortBio")}
                    radius="1.5em"
                />
            </div>
            <Button
                radius="1.5em"
                type="submit"
                loading={userInfoMutation.isLoading}
            >
                Update
            </Button>
        </form>
    );
}
