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
    Text,
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
import { useQueryClient } from "react-query";

moment.updateLocale(moment.locale(), { invalidDate: "Unknown Date" });

export default function MartEditor({ mart }) {
    const [martPhotoFile, setMartPhotoFile] = useState();
    //
    const [selectedBirthLocation, setSelectedBirthLocation] = useState(
        mart.birthplace ? mart.birthplace : null
    );
    const [birthLocationError, setBirthLocationError] = useState(false);
    const [selectedDeathLocation, setSelectedDeathLocation] = useState(
        mart.deathplace ? mart.deathplace : null
    );
    const [deathLocationError, setDeathLocationError] = useState(false);
    //
    const [deathLocUnknown, setDeathLocUnknown] = useState(false);
    const [birthLocUnknown, setBirthLocUnknown] = useState(false);
    //
    const [hasPhoto, setHasPhoto] = useState(
        mart.cloudinaryParams ? true : false
    );
    const [photoRemoved, setPhotoRemoved] = useState(false);
    const [photoChanged, setPhotoChanged] = useState();
    //
    const [isUploading, setIsUploading] = useState(false);
    //
    const queryClient = useQueryClient();

    const form = useForm({
        initialValues: {
            firstName: mart?.firstName,
            middleName: mart?.middleName,
            lastName: mart?.lastName,
            sex: mart?.sex,
            born: mart.born ? moment(mart.born.toString())._d : "",
            died: mart.died ? moment(mart.died.toString())._d : "",
            shortBio: mart?.shortBio,
            wikiLink: mart?.wikiLink,
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

        if (martPhotoFile && !hasPhoto) {
            console.log("one");
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
            const dbResponse = await axios.put(`/api/marts/${mart._id}`, bod);
            //console.log(dbResponse.data.data);
        } else {
            console.log("two");
            let bod = {
                documentData: {
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
                },
            };
            //if file input is left empty when !hasPhoto, photo has been removed
            if (photoRemoved) {
                console.log("three");
                bod = {
                    ...bod,
                    photoRemoved: true,
                    cloudinaryParams: mart?.cloudinaryParams,
                    documentData: {
                        ...bod.documentData,
                        cloudinaryParams: null,
                    },
                };
            }

            const dbResponse = await axios.put(`/api/marts/${mart._id}`, bod);
        }

        setIsUploading(false);
        queryClient.invalidateQueries({ queryKey: "user-uploaded-marts" });
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
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Stack spacing="xs">
                <Text fz="lg" fw="bolder" c="gray">
                    Name
                </Text>
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
                <Text fz="lg" fw="bolder" c="gray" mt="md">
                    Dates
                </Text>
                <Paper withBorder p="md">
                    <Stack spacing="lg">
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
                    </Stack>
                </Paper>
                <Text fz="lg" fw="bolder" c="gray" mt="md">
                    Places
                </Text>
                <Paper withBorder p="md">
                    <Stack spacing="lg">
                        {!selectedBirthLocation ? (
                            <Group spacing="md" align="center">
                                {!birthLocUnknown && (
                                    <LocationAutocompleteV2
                                        setSelectedLocation={
                                            setSelectedBirthLocation
                                        }
                                        locationError={birthLocationError}
                                        setLocationError={setBirthLocationError}
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
                        ) : (
                            <Text size="sm">
                                {`Place of Birth: ${selectedBirthLocation.value}.`}{" "}
                                <Text
                                    span
                                    italic
                                    underline
                                    color="blue"
                                    onClick={() =>
                                        setSelectedBirthLocation(null)
                                    }
                                >
                                    change
                                </Text>
                            </Text>
                        )}
                        {!selectedDeathLocation ? (
                            <Group spacing="md" align="center">
                                {!deathLocUnknown && (
                                    <LocationAutocompleteV2
                                        setSelectedLocation={
                                            setSelectedDeathLocation
                                        }
                                        locationError={deathLocationError}
                                        setLocationError={setDeathLocationError}
                                        label="Place of Death"
                                        id="death"
                                    />
                                )}
                                <Checkbox
                                    checked={deathLocUnknown}
                                    onChange={(event) =>
                                        setDeathLocUnknown(
                                            event.currentTarget.checked
                                        )
                                    }
                                    label="Place of Death Unknown"
                                    size="sm"
                                />
                            </Group>
                        ) : (
                            <Text size="sm">
                                {`Place of Death: ${selectedDeathLocation.value}.`}{" "}
                                <Text
                                    span
                                    italic
                                    underline
                                    color="blue"
                                    onClick={() =>
                                        setSelectedDeathLocation(null)
                                    }
                                >
                                    change
                                </Text>
                            </Text>
                        )}
                    </Stack>
                </Paper>
                <Text fz="lg" fw="bolder" c="gray" mt="md">
                    Bio
                </Text>
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

                        <TextInput
                            label="Wiki Link"
                            placeholder="link"
                            {...form.getInputProps("wikiLink")}
                        />
                    </Stack>
                </Paper>
                <Text fz="lg" fw="bolder" c="gray" mt="md">
                    Photo
                </Text>
                <Paper withBorder p="md">
                    {!hasPhoto ? (
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
                    ) : (
                        <Text fz="md">
                            photo already uploaded{" "}
                            <Text
                                span
                                color="blue"
                                onClick={() => {
                                    setHasPhoto(false);
                                    setPhotoRemoved(true);
                                }}
                                italic
                                underline
                            >
                                remove photo
                            </Text>
                        </Text>
                    )}
                </Paper>

                <Group position="left" mt="md">
                    <Button type="submit" loading={isUploading}>
                        Submit
                    </Button>
                </Group>
            </Stack>
        </form>
    );
}
