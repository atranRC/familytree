import {
    Button,
    Divider,
    Radio,
    TextInput,
    Textarea,
    Title,
    createStyles,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import { useState } from "react";
import {
    IconBallon,
    IconGenderFemale,
    IconGenderMale,
    IconWritingSign,
} from "@tabler/icons";
import { useStyles } from "./NewUserFormStyles";
import { useSession } from "next-auth/react";

export default function NewUserForm({ form, onSubmit, loading }) {
    const { data: session, status } = useSession();
    const [birthplaceLocationError, setBirthplaceLocationError] =
        useState(false);
    const [currentResidenceLocationError, setCurrentResidenceLocationError] =
        useState(false);
    const { classes } = useStyles();
    return (
        <form onSubmit={onSubmit} className={classes.formCont}>
            <Title
                color="#3c414a"
                align="center"
                weight={900}
            >{`👋🏼 Hello, ${session?.user.name}!`}</Title>
            <Title align="center" color="dimmed" order={3}>
                Tell us about yourself
            </Title>
            <Divider />
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
                    description="Your Birthday"
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
            <Radio.Group
                withAsterisk
                label="Gender"
                description="Your Gender"
                /*onChange={(e) => {
                                    form.setValues({ ...form.values, sex: e });
                                }}*/
                sx={{ flexGrow: 1 }}
                radius="1.5em"
                {...form.getInputProps("sex")}
            >
                <Radio value="female" label="Female" />
                <Radio value="male" label="Male" />
            </Radio.Group>
            <div className={classes.locationSection}>
                <div className={classes.location}>
                    <LocationAutocompleteV2
                        setSelectedLocation={(loc) =>
                            form.setValues({
                                ...form.values,
                                birth_place: loc,
                            })
                        }
                        locationError={birthplaceLocationError}
                        setLocationError={setBirthplaceLocationError}
                        label="Birthplace"
                        placeholder="Enter location name"
                        id="birthplace"
                    />
                </div>
                <div className={classes.location}>
                    <LocationAutocompleteV2
                        setSelectedLocation={(loc) =>
                            form.setValues({
                                ...form.values,
                                current_residence: loc,
                            })
                        }
                        locationError={currentResidenceLocationError}
                        setLocationError={setCurrentResidenceLocationError}
                        label="Current Residence"
                        placeholder="Enter location name"
                        id="current_residence"
                    />
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
            <Button radius="1.5em" type="submit" loading={loading}>
                Continue
            </Button>
        </form>
    );
}
