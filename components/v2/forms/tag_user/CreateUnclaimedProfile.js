import {
    Button,
    Divider,
    Group,
    Paper,
    Radio,
    Stack,
    Switch,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

import { createStyles } from "@mantine/core";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { useState } from "react";

const useStyles = createStyles((theme, { name }) => ({
    cont: {
        padding: "5px",
        background: name ? "#4C6EF5" : "lightgray",
        //height: "50%",
        borderRadius: "1.5em",
        overflow: "auto",
    },
    namesCont: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "1em",
    },
    locationsCont: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "1em",
    },
    location: {
        flexGrow: 1,
        maxWidth: "50%",
        "@media (max-width: 800px)": {
            maxWidth: "100%",
        },
    },
    genderAndBirthCont: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "1em",
    },
}));

export default function CreateUnclaimedProfile({
    treeMember,
    onSuccess,
    onError,
}) {
    const [birthplaceLocationError, setBirthplaceLocationError] =
        useState(false);
    const [currentResidenceLocationError, setCurrentResidenceLocationError] =
        useState(false);
    const [isDeceased, setIsDeceased] = useState(false);
    const form = useForm({
        initialValues: {
            name: "",
            fathersName: "",
            lastName: "",
            sex: "",
            birthDate: null,
            birthPlace: null,
            currentResidence: null,
            nicknames: "",
            shortBio: "",
            died: null,
        },

        validate: {
            name: (value) =>
                value.length < 2 || value.length > 40 ? "Invalid name" : null,
            sex: (value) => (value === "" ? "Invalid" : null),
            shortBio: (value) => (value.length > 400 ? "Invalid name" : null),
        },
    });
    const { classes } = useStyles({ name: form.values.name });
    const queryClient = useQueryClient();

    // create tree
    const createProfileMutation = useMutation({
        mutationFn: (bod) => {
            return axios.post(
                `/api/family-tree-api/tree-members-b/v2/tag-unclaimed-profile?treeMemberId=${treeMember._id.toString()}&treeId=${treeMember.treeId.toString()}`,
                bod
            );
        },
        onSuccess: (res) => {
            //console.log(res.data);
            form.reset();
            queryClient.invalidateQueries({
                queryKey: ["get_treemember_balkanid_treeid"],
            });
            onSuccess("Unclaimed Profile Tagged Successfully");
        },
        onError: () => {
            onError();
            //notifyError();
        },
    });

    const handleSubmit = (values) => {
        //console.log("form values", values);
        const bod = {
            name: values.name,
            birth_place: values.birthPlace,
            birthday: values.birthDate,
            current_residence: values.currentResidence,
            fathers_name: values.fathersName,
            last_name: values.lastName,
            sex: values.sex,
            nicknames: values.nicknames,
            shortBio: values.shortBio,
            died: values.died,
        };
        //console.log("bod", bod);
        createProfileMutation.mutate(bod);
    };

    return (
        <div className={classes.cont}>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Paper p={"sm"} radius="1.5rem" withBorder>
                    <Stack>
                        <Title
                            order={3}
                            align="center"
                            color={form.values.name ? "darkblue" : "black"}
                        >
                            {"Create " +
                                (`${
                                    form.values.name &&
                                    form.values.name + "'s profile"
                                }` || " a New Profile")}
                        </Title>
                        <Divider />

                        <div className={classes.namesCont}>
                            <TextInput
                                withAsterisk
                                label="First Name"
                                sx={{ flexGrow: 1 }}
                                //description="Name of this Family Tree"
                                {...form.getInputProps("name")}
                                radius="xl"
                            />
                            <TextInput
                                label="Fathers Name"
                                //description="Name of this Family Tree"
                                sx={{ flexGrow: 1 }}
                                {...form.getInputProps("fathersName")}
                                radius="xl"
                            />
                            <TextInput
                                label="Last Name"
                                //description="Name of this Family Tree"
                                sx={{ flexGrow: 1 }}
                                {...form.getInputProps("lastName")}
                                radius="xl"
                            />
                            <TextInput
                                label="Nick Names"
                                //description="Name of this Family Tree"
                                sx={{ flexGrow: 1 }}
                                {...form.getInputProps("nicknames")}
                                radius="xl"
                            />
                        </div>
                        <div className={classes.genderAndBirthCont}>
                            <Radio.Group
                                withAsterisk
                                name="favoriteFramework"
                                label="Gender"
                                /*onChange={(e) => {
                                    form.setValues({ ...form.values, sex: e });
                                }}*/
                                {...form.getInputProps("sex")}
                                sx={{ flexGrow: 1 }}
                            >
                                <Radio value="female" label="Female" />
                                <Radio value="male" label="Male" />
                            </Radio.Group>
                            <DatePicker
                                placeholder="Pick date"
                                label="Birthday"
                                radius="xl"
                                onChange={(e) => {
                                    form.setValues({
                                        ...form.values,
                                        birthDate: e,
                                    });
                                }}
                                sx={{ flexGrow: 1 }}
                            />
                        </div>
                        <Switch
                            label="Deceased"
                            description="This option disables Current Residence and enables Date of Death option."
                            mt="1em"
                            mb="1em"
                            checked={isDeceased}
                            onChange={(event) =>
                                setIsDeceased(event.currentTarget.checked)
                            }
                        />
                        <div className={classes.locationsCont}>
                            <div className={classes.location}>
                                <LocationAutocompleteV2
                                    setSelectedLocation={(loc) =>
                                        form.setValues({
                                            ...form.values,
                                            birthPlace: loc,
                                        })
                                    }
                                    locationError={birthplaceLocationError}
                                    setLocationError={
                                        setBirthplaceLocationError
                                    }
                                    label="Birthplace"
                                    placeholder="Enter location name"
                                    id="birthplace"
                                />
                            </div>
                            <div className={classes.location}>
                                {isDeceased ? (
                                    <DatePicker
                                        placeholder="Pick date"
                                        label="Date of Death"
                                        description="Select the date of death"
                                        radius="xl"
                                        onChange={(e) => {
                                            form.setValues({
                                                ...form.values,
                                                died: e,
                                            });
                                        }}
                                        sx={{ flexGrow: 1 }}
                                    />
                                ) : (
                                    <LocationAutocompleteV2
                                        setSelectedLocation={(loc) =>
                                            form.setValues({
                                                ...form.values,
                                                currentResidence: loc,
                                            })
                                        }
                                        locationError={
                                            currentResidenceLocationError
                                        }
                                        setLocationError={
                                            setCurrentResidenceLocationError
                                        }
                                        label="Current Residence"
                                        placeholder="Enter location name"
                                        id="current_residence"
                                    />
                                )}
                            </div>
                        </div>
                        <Textarea
                            label="Short Introduction"
                            description={`say a few words about ${form.values.name}`}
                            placeholder="short introduction"
                            sx={{ flexGrow: 1 }}
                            {...form.getInputProps("shortBio")}
                            radius="1.5em"
                        />
                        <Stack spacing={1}>
                            <Button
                                type="submit"
                                radius="lg"
                                color="indigo"
                                disabled={!form.values.name || !form.values.sex}
                                loading={createProfileMutation.isLoading}
                                onSubmit={handleSubmit}
                            >
                                {createProfileMutation.isLoading &&
                                    `Creating ${form.values.name}'s Profile...`}
                                {!createProfileMutation.isLoading &&
                                    `Create ${form.values.name}${
                                        form.values.name && "'s"
                                    } Profile`}
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </form>
        </div>
    );
}
