import {
    Button,
    Divider,
    Paper,
    Stack,
    Switch,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useMutation } from "react-query";

export default function AddTree({ onCancel, onSuccess, onError }) {
    const form = useForm({
        initialValues: {
            treeName: "",
            description: "",
            privacy: "private",
        },

        validate: {
            treeName: (value) =>
                value.length < 2 || value.length > 40 ? "Invalid name" : null,
            description: (value) =>
                value.length > 500 ? "Invalid description" : null,
        },
    });
    // add first member
    const addFirstMemberMutation = useMutation({
        mutationFn: (newTree) => {
            return axios.post(
                `/api/family-tree-api/tree-members-b/v2/add-first-member`,
                newTree
            );
        },
        onSuccess: (res) => {
            onSuccess();
            //console.log("first member created", res.data);
        },
        onError: () => {
            onError();
            //notifyError();
        },
    });

    // create tree
    const createTreeMutation = useMutation({
        mutationFn: () => {
            return axios.post("/api/v2/fam-trees", {
                tree_name: form.values.treeName,
                description: form.values.description,
                privacy: form.values.privacy,
            });
        },
        onSuccess: (res) => {
            /*notifySuccess();
          queryClient.invalidateQueries({
            queryKey: ["get_tree_memberships_profile"],
          });*/
            console.log(res.data);
            addFirstMemberMutation.mutate(res.data);
        },
        onError: () => {
            onError();
            //notifyError();
        },
    });

    const handleSubmit = (values) => {
        createTreeMutation.mutate();
    };
    return (
        <Paper
            withBorder
            p="md"
            bg={form.values.treeName ? "indigo" : "lightgray"}
            radius="1.5rem"
        >
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Paper p={"sm"} radius="1.5rem" withBorder>
                    <Stack>
                        <Title
                            order={3}
                            align="center"
                            color={form.values.treeName ? "darkblue" : "black"}
                        >
                            {"Create " +
                                (form.values.treeName || " a New Family Tree")}
                        </Title>
                        <Divider />
                        <TextInput
                            withAsterisk
                            label="Tree Name"
                            description="Name of this Family Tree"
                            {...form.getInputProps("treeName")}
                        />
                        <Textarea
                            description="Describe this Family Tree in a few words"
                            label="Description"
                            withAsterisk
                            autosize
                            minRows={2}
                            maxRows={6}
                            {...form.getInputProps("description")}
                        />
                        <Switch
                            label="Make Tree Public"
                            size="md"
                            color="indigo"
                            onChange={(event) =>
                                event.currentTarget.checked
                                    ? form.setValues({
                                          ...form.values,
                                          privacy: "public",
                                      })
                                    : form.setValues({
                                          ...form.values,
                                          privacy: "private",
                                      })
                            }
                            description={
                                form.values.privacy === "private"
                                    ? "Only You and its Members can see this tree"
                                    : "Anyone can see this tree"
                            }
                        />
                        <Stack spacing={1}>
                            <Button
                                type="submit"
                                radius="lg"
                                color="indigo"
                                disabled={!form.values.treeName}
                                loading={
                                    createTreeMutation.isLoading ||
                                    addFirstMemberMutation.isLoading
                                }
                                onSubmit={handleSubmit}
                            >
                                {(createTreeMutation.isLoading ||
                                    addFirstMemberMutation.isLoading) &&
                                    `Creating ${form.values.treeName}...`}
                                {!(
                                    createTreeMutation.isLoading ||
                                    addFirstMemberMutation.isLoading
                                ) && `Create ${form.values.treeName}`}
                            </Button>
                            <Button radius="lg" color="gray" onClick={onCancel}>
                                Cancel
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </form>
        </Paper>
    );
}
