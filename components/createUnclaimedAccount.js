import { useForm, isNotEmpty } from "@mantine/form";
import {
    Stepper,
    NumberInput,
    TextInput,
    Button,
    Stack,
    Select,
    Container,
    Group,
    Avatar,
    Text,
} from "@mantine/core";
import {
    IconCalendarEvent,
    IconCircleCheck,
    IconUser,
    IconWriting,
} from "@tabler/icons";
import { citiesData } from "../pages/demo/auth-demo/cities";
import { forwardRef, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { DatePicker } from "@mantine/dates";
import axios from "axios";

export function CreateUnclaimedAccount({ ownerData }) {
    const [active, setActive] = useState(0);
    /*const [name, setName] = useState("");
    const [fathersName, setFathersName] = useState("");
    const [nicknames, setNicknames] = useState("");*/
    const [birthplace, setBirthPlace] = useState("");
    const [currentResidence, setCurrentResidence] = useState("");
    const [birthday, setBirthday] = useState("");
    const [errorFillingForm, setErrorFillingForm] = useState();

    const form = useForm({
        initialValues: {
            name: "",
            fathersName: "",
            nicknames: "",
            /*birthplace: "",
            birthday: "",
            currentResidence: "",*/
        },

        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => (value.length > 20 ? "error on name" : null),
            fathersName: (value) =>
                value.length > 20 ? "error on fathersname" : null,
            nicknames: (value) =>
                value.length > 20 ? "error on nicknames" : null,
            /*birthplace: (value) =>
                value.length > 20 ? "error on bplace" : null,
            birthday: (value) => (value === null ? "enter bday" : null),
            currentResidence: (value) =>
                value.length > 20 ? "Name must have at least 2 letters" : null,*/
        },
    });
    const SelectItem = forwardRef(function search4(
        { image, label, description, ...others },
        ref
    ) {
        return (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        );
    });
    const handleError = (errors) => {
        if (errors.name) {
            console.log(errors.name);
            setErrorFillingForm(errors.name);
            /*showNotification({
                message: "Please fill name field",
                color: "red",
            });*/
        }
    };

    const handleSubmit = async (values) => {
        console.log("hola");
        const reqBody = {
            name: values.name,
            fathers_name: values.fathersName,
            nicknames: values.nicknames,
            current_residence: currentResidence,
            birth_place: birthplace,
            birthday: birthday,
            owner: ownerData._id.toString(),
        };
        const res = await axios.post(
            "/api/users/add-unclaimed-account",
            reqBody
        );
        const createdUser = await res.data;
        console.log("created user", createdUser);
    };
    return (
        <Container size="lg" style={{ height: "100vh" }} pt="xl">
            <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
                <Stepper
                    breakpoint="sm"
                    active={active}
                    onStepClick={setActive}
                    size="xs"
                    completedIcon={<IconCircleCheck />}
                >
                    <Stepper.Step
                        icon={<IconWriting size={18} />}
                        label="Relative's info"
                        description="Names"
                    >
                        <Stack>
                            <TextInput
                                label="Name"
                                placeholder="Name"
                                {...form.getInputProps("name")}
                            />
                            <TextInput
                                label="Father's name"
                                placeholder="fathers name"
                                {...form.getInputProps("fathersName")}
                            />
                            <TextInput
                                label="nicknames"
                                placeholder="nicknames"
                                {...form.getInputProps("nicknames")}
                            />
                            <Button
                                onClick={() => {
                                    setErrorFillingForm("");
                                    setActive(1);
                                }}
                            >
                                Save and Continue
                            </Button>
                        </Stack>
                    </Stepper.Step>
                    <Stepper.Step
                        icon={<IconCalendarEvent size={18} />}
                        label="Relative's info"
                        description="Dates and Location"
                    >
                        <Select
                            label="Place of birth"
                            placeholder="Pick one"
                            itemComponent={SelectItem}
                            description="Your relative's birthplace"
                            data={citiesData}
                            searchable
                            maxDropdownHeight={300}
                            nothingFound="Nothing found"
                            filter={(value, item) =>
                                item.label
                                    .toLowerCase()
                                    .includes(value.toLowerCase().trim()) ||
                                item.description
                                    .toLowerCase()
                                    .includes(value.toLowerCase().trim())
                            }
                            onChange={setBirthPlace}
                        />
                        <Select
                            label="Location"
                            placeholder="Pick one"
                            itemComponent={SelectItem}
                            description="City your relative currently lives in"
                            data={citiesData}
                            searchable
                            maxDropdownHeight={300}
                            nothingFound="Nothing found"
                            filter={(value, item) =>
                                item.label
                                    .toLowerCase()
                                    .includes(value.toLowerCase().trim()) ||
                                item.description
                                    .toLowerCase()
                                    .includes(value.toLowerCase().trim())
                            }
                            onChange={setCurrentResidence}
                        />
                        <DatePicker
                            placeholder="Pick date"
                            label="Birthday"
                            onChange={setBirthday}
                        />
                        <Button onClick={() => setActive(2)}>
                            Save and Continue
                        </Button>
                    </Stepper.Step>

                    <Stepper.Step
                        icon={<IconUser size={18} />}
                        label="Similar Profiles"
                        description="Similar profiles"
                    >
                        {errorFillingForm && (
                            <Text size="sm" c="red">
                                {errorFillingForm}
                            </Text>
                        )}
                        <Button type="submit" mt="sm" onSubmit={handleSubmit}>
                            Submit
                        </Button>
                    </Stepper.Step>
                </Stepper>
            </form>
        </Container>
    );
}
