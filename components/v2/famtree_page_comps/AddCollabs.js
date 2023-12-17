import {
    Button,
    Paper,
    Stack,
    Tabs,
    Text,
    TextInput,
    Notification,
    Checkbox,
    Loader,
} from "@mantine/core";
import { IconAt, IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { createStyles } from "@mantine/core";
import EmailNotFoundWithInvite from "../empty_data_comps/email_not_found_w_invite/EmailNotFoundWithInvite";

function AddWithEmail({ tree }) {
    const { data: session, status } = useSession();
    const [collabEmail, setCollabEmail] = useState("");
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    const notifyAddSuccess = () => toast.success("Collaborator Added");
    const notifyGmailOnly = () =>
        toast.error("We currently support gmail authentication only");

    const addCollabMutation = useMutation({
        mutationFn: () => {
            const bod = {
                email: collabEmail,
                treeId: tree._id,
            };

            return axios.post(
                `/api/family-tree-api/tree-members-b/add-collab`,
                bod
            );
        },
        onSuccess: (data) => {
            setCollabEmail("");
            notifyAddSuccess();
        },
        onError: (err) => {
            setShowErrorNotification(true);
        },
    });

    return (
        <Paper withBorder p="md">
            <Stack spacing={1}>
                <Text align="center" size="sm" fw={500} c="dimmed">
                    Enter the email of the user you would like to add as a
                    collaborator for this tree
                </Text>

                <TextInput
                    label="Email"
                    value={collabEmail}
                    description="user email"
                    icon={<IconAt size={19} />}
                    placeholder="email"
                    onChange={(e) => setCollabEmail(e.target.value)}
                    onFocus={() => {
                        setShowErrorNotification(false);
                    }}
                />
                {showErrorNotification && (
                    <EmailNotFoundWithInvite
                        email={collabEmail}
                        tree={tree}
                        invitationType="collab"
                    />
                )}
                <Button
                    mt="sm"
                    variant="outline"
                    onClick={() => {
                        const regex = new RegExp("^[a-zA-Z0-9-_.]+@gmail.com$");
                        if (regex.test(collabEmail)) {
                            addCollabMutation.mutate();
                        } else {
                            notifyGmailOnly();
                        }
                    }}
                    disabled={collabEmail === "" || addCollabMutation.isLoading}
                    loading={addCollabMutation.isLoading}
                >
                    Add Collaborator
                </Button>
            </Stack>
            <Toaster />
        </Paper>
    );
}

function ManageCollabs({ tree }) {
    const [existingCollabs, setExistingCollabs] = useState(null);
    const [showSuccessNotification, setShowSuccessNotification] =
        useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [selectedCollabs, setSelectedCollabs] = useState([]);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get_existing_collaborators",
        queryFn: () => {
            return axios.get(
                `/api/family-tree-api/tree-members-b/get-collabs/${tree._id}`
            );
        },
        //enabled: false,
        onSuccess: (d) => {
            setExistingCollabs(d.data.data);
        },
    });

    const {
        isLoading: isLoadingDelete,
        isFetching: isFetchingDelete,
        data: dataDelete,
        refetch: refetchDelete,
        isError: isErrorDelete,
        error: errorDelete,
    } = useQuery({
        queryKey: "delete_collaborator",
        queryFn: () => {
            const bod = {
                collabsToDelete: selectedCollabs,
            };
            return axios.post(
                `/api/family-tree-api/tree-members-b/delete-collabs/`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("deleted");
            refetch();
        },
    });

    const handleDeleteCollabs = () => {
        refetchDelete();
    };

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (error) {
        return <div>error fetching collaborators</div>;
    }

    if (existingCollabs.length < 1) {
        return <div>this tree has no collaborators</div>;
    }

    return (
        <Paper withBorder p="md">
            <Stack spacing={1}>
                <Text align="center" size="sm" fw={500} c="dimmed">
                    This tree has the following collaborators
                </Text>
                <Checkbox.Group
                    value={selectedCollabs}
                    onChange={setSelectedCollabs}
                >
                    {existingCollabs.map((collab) => {
                        return (
                            <Checkbox
                                key={collab._id.toString()}
                                value={collab._id.toString()}
                                label={collab.name}
                            />
                        );
                    })}
                </Checkbox.Group>
                {showSuccessNotification && (
                    <Notification
                        icon={<IconCheck size="1.1rem" />}
                        color="teal"
                        title="Success"
                    >
                        Collaborator removed
                    </Notification>
                )}
                {showErrorNotification && (
                    <Notification icon={<IconX size="1.1rem" />} color="red">
                        Failed to remove collaborator
                    </Notification>
                )}
                <Button
                    mt="sm"
                    variant="outline"
                    loading={isLoadingDelete || isFetchingDelete}
                    disabled={selectedCollabs.length < 1}
                    onClick={handleDeleteCollabs}
                >
                    Remove Collaborator
                </Button>
            </Stack>
        </Paper>
    );
}

export default function AddCollabs({ tree }) {
    const [activeTab, setActiveTab] = useState("existing");
    return (
        <Paper style={{ backgroundColor: "#f8f8f8" }} p="md">
            <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="existing">Manage Collaborators</Tabs.Tab>
                    <Tabs.Tab value="add">Add Collaborator</Tabs.Tab>
                </Tabs.List>
            </Tabs>
            {activeTab === "existing" ? (
                <ManageCollabs tree={tree} />
            ) : (
                <AddWithEmail tree={tree} />
            )}
        </Paper>
    );
}
