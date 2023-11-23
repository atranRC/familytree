import {
    Button,
    Checkbox,
    Container,
    Divider,
    FileInput,
    Group,
    Input,
    MediaQuery,
    Paper,
    Radio,
    SimpleGrid,
    Stack,
    TextInput,
    Textarea,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconUpload } from "@tabler/icons";
import { useState } from "react";
import LocationAutocompleteV2 from "../../location/location_autocomplete/LocationAutoCompleteV2";
import axios from "axios";
import moment from "moment";

export default function AddMart({ sessionUserId }) {
    const [martPhotoFile, setMartPhotoFile] = useState();
    //
    const [selectedBirthLocation, setSelectedBirthLocation] = useState(null);
    const [birthLocationError, setBirthLocationError] = useState(false);
    const [selectedDeathLocation, setSelectedDeathLocation] = useState(null);
    const [deathLocationError, setDeathLocationError] = useState(false);
    //
    const [deathLocUnknown, setDeathLocUnknown] = useState(false);
    const [birthLocUnknown, setBirthLocUnknown] = useState(false);
    //
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm({
        initialValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            sex: "",
            born: "",
            died: "",
            shortBio: "",
            wikiLink: "",
        },

        validate: {
            firstName: (value) =>
                value.length < 2
                    ? "First name must have at least 2 letters"
                    : null,
            sex: (value) => (value === "" ? "Please choose an option" : null),
            shortBio: (value) =>
                value.length > 999
                    ? "bio must be less than 1000 characters"
                    : null,
        },
    });

    const handleUpload = async (values) => {
        setIsUploading(true);

        if (martPhotoFile) {
            const signatureResponse = await axios.get(
                "/api/cloudinary/get_sign?preset=marts_uploads_preset"
            );

            const fData = new FormData();
            fData.append("file", martPhotoFile);
            fData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
            fData.append("signature", signatureResponse.data.signature);
            fData.append("timestamp", signatureResponse.data.timestamp);
            fData.append("upload_preset", "marts_uploads_preset");

            const cloudinaryResponse = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                fData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            const bod = {
                signature: cloudinaryResponse.data.signature,
                documentData: {
                    uploaderId: sessionUserId,
                    firstName: values.firstName,
                    middleName: values.middleName,
                    lastName: values.lastName,
                    sex: values.sex,
                    born: moment(values.born).toISOString(),
                    died: moment(values.died).toISOString(),
                    birthplace: selectedBirthLocation,
                    deathplace: selectedDeathLocation,
                    shortBio: values.shortBio,
                    wikiLink: values.wikiLink,
                    cloudinaryParams: {
                        cloud_name:
                            process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                        resource_type: cloudinaryResponse.data.resource_type,
                        type: cloudinaryResponse.data.type,
                        version: cloudinaryResponse.data.version,
                        public_id: cloudinaryResponse.data.public_id,
                        format: cloudinaryResponse.data.format,
                        tags: cloudinaryResponse.data.tags,
                        signature: cloudinaryResponse.data.signature,
                    },
                },
            };
            const dbResponse = await axios.post("/api/marts", bod);
            //console.log(dbResponse.data.data);
        } else {
            const bod = {
                documentData: {
                    uploaderId: sessionUserId,
                    firstName: values.firstName,
                    middleName: values.middleName,
                    lastName: values.lastName,
                    sex: values.sex,
                    born: moment(values.born).toISOString(),
                    died: moment(values.died).toISOString(),
                    birthplace: selectedBirthLocation,
                    deathplace: selectedDeathLocation,
                    shortBio: values.shortBio,
                    wikiLink: values.wikiLink,
                    cloudinaryParams: null,
                },
            };
            const dbResponse = await axios.post("/api/marts", bod);
        }

        setIsUploading(false);
    };

    const handleClear = () => {
        setMartPhotoFile();
    };

    const handleSubmit = (values) => {
        if (
            (!birthLocUnknown && !selectedBirthLocation) ||
            (!deathLocUnknown && !selectedDeathLocation)
        ) {
            if (!selectedBirthLocation && !birthLocUnknown)
                setBirthLocationError(true);
            if (!selectedDeathLocation && !deathLocUnknown)
                setDeathLocationError(true);
        } else {
            handleUpload(values);
            /*console.log("values", values);
            console.log("bod", {
                uploaderId: sessionUserId,
                firstName: values.firstName,
                middleName: values.middleName,
                lastName: values.lastName,
                sex: values.sex,
                born: values.born,
                died: values.died,
                birthplace: selectedBirthLocation,
                deathplace: selectedDeathLocation,
                shortBio: values.shortBio,
                wikiLink: values.wikiLink,
            });
            console.log("birth", selectedBirthLocation);
            console.log("death", selectedDeathLocation);*/
        }
    };
    return (
        <Paper withBorder p="md">
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Stack>
                    <Paper withBorder p="md">
                        <Stack spacing="lg">
                            <SimpleGrid
                                breakpoints={[
                                    { minWidth: "sm", cols: 1 },
                                    { minWidth: "md", cols: 2 },
                                    { minWidth: 1200, cols: 3 },
                                ]}
                            >
                                <TextInput
                                    withAsterisk
                                    label="First Name"
                                    placeholder="name"
                                    {...form.getInputProps("firstName")}
                                />
                                <TextInput
                                    label="Middle Name"
                                    placeholder="name"
                                    {...form.getInputProps("middleName")}
                                />
                                <TextInput
                                    label="Last Name"
                                    placeholder="name"
                                    {...form.getInputProps("lastName")}
                                />
                            </SimpleGrid>

                            <Radio.Group
                                name="sex"
                                label="Sex"
                                {...form.getInputProps("sex")}
                            >
                                <Radio value="female" label="Female" />
                                <Radio value="male" label="Male" />
                            </Radio.Group>
                        </Stack>
                    </Paper>
                    <Paper withBorder p="md">
                        <Stack spacing="lg">
                            <SimpleGrid
                                breakpoints={[
                                    { minWidth: "sm", cols: 1 },
                                    { minWidth: "md", cols: 2 },
                                    { minWidth: 1200, cols: 3 },
                                ]}
                            >
                                <DatePicker
                                    placeholder="Pick date"
                                    label="Born"
                                    {...form.getInputProps("born")}
                                />
                                <DatePicker
                                    placeholder="Pick date"
                                    label="Died"
                                    {...form.getInputProps("died")}
                                />
                            </SimpleGrid>
                            <SimpleGrid
                                breakpoints={[
                                    { minWidth: "sm", cols: 1 },
                                    { minWidth: "md", cols: 2 },
                                    { minWidth: 1200, cols: 3 },
                                ]}
                            >
                                <Group spacing="md" align="center">
                                    {!birthLocUnknown && (
                                        <LocationAutocompleteV2
                                            setSelectedLocation={
                                                setSelectedBirthLocation
                                            }
                                            locationError={birthLocationError}
                                            setLocationError={
                                                setBirthLocationError
                                            }
                                            label="Place of Birth"
                                            id="birth"
                                        />
                                    )}
                                    <Checkbox
                                        checked={birthLocUnknown}
                                        onChange={(event) => {
                                            setBirthLocUnknown(
                                                event.currentTarget.checked
                                            );
                                            if (event.currentTarget.checked)
                                                setSelectedBirthLocation(null);
                                        }}
                                        label="Place of Birth Unknown"
                                        size="sm"
                                    />
                                </Group>
                                <Group spacing="md" align="center">
                                    {!deathLocUnknown && (
                                        <LocationAutocompleteV2
                                            setSelectedLocation={
                                                setSelectedDeathLocation
                                            }
                                            locationError={deathLocationError}
                                            setLocationError={
                                                setDeathLocationError
                                            }
                                            label="Place of Death"
                                            id="death"
                                        />
                                    )}
                                    <Checkbox
                                        checked={deathLocUnknown}
                                        onChange={(event) => {
                                            setDeathLocUnknown(
                                                event.currentTarget.checked
                                            );
                                            if (event.currentTarget.checked)
                                                setSelectedDeathLocation(null);
                                        }}
                                        label="Place of Death Unknown"
                                        size="sm"
                                    />
                                </Group>
                            </SimpleGrid>
                        </Stack>
                    </Paper>
                    <Paper withBorder p="md">
                        <Stack spacing="lg">
                            <Textarea
                                label="Short Bio"
                                placeholder="short bio"
                                autosize
                                minRows={4}
                                maxRows={10}
                                {...form.getInputProps("shortBio")}
                            />

                            <FileInput
                                //ref={inputRef}
                                //type="file"
                                label="Picture"
                                accept="image/png,image/jpeg,image/jpg"
                                value={martPhotoFile}
                                onChange={setMartPhotoFile}
                                //onChange={() => setPhotos(inputRef.current.files)}
                                placeholder="Click here to add photo"
                                //label="Upload Photos"
                                //description="Add photos related to this event"
                                radius="xl"
                                size="md"
                                icon={<IconUpload size={14} />}
                            />

                            <TextInput
                                label="Wiki Link"
                                placeholder="link"
                                {...form.getInputProps("wikiLink")}
                            />
                        </Stack>
                    </Paper>

                    <Group position="left" mt="md">
                        <Button type="submit" loading={isUploading}>
                            Submit
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    );
}
