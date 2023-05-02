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
import { useQuery } from "react-query";

function AddWithEmail({ treeId }) {
    const [collabEmail, setCollabEmail] = useState("");
    const [showSuccessNotification, setShowSuccessNotification] =
        useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "add_collaborator",
        queryFn: () => {
            const bod = {
                email: collabEmail,
                treeId: treeId,
            };
            return axios.post(
                `/api/family-tree-api/tree-members-b/add-collab`,
                bod
            );
        },
        enabled: false,
        onSuccess: (d) => {
            setCollabEmail("");
            setShowSuccessNotification(true);
        },
        onError: (err) => {
            setCollabEmail("");
            setShowErrorNotification(true);
        },
    });

    const handleAddCollab = () => {
        refetch();
    };

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
                        setShowSuccessNotification(false);
                    }}
                />
                {showSuccessNotification && (
                    <Notification
                        icon={<IconCheck size="1.1rem" />}
                        color="teal"
                        title="Success"
                    >
                        Collaborator added
                    </Notification>
                )}
                {showErrorNotification && (
                    <Notification icon={<IconX size="1.1rem" />} color="red">
                        Failed to add collaborator
                    </Notification>
                )}
                <Button
                    mt="sm"
                    variant="outline"
                    onClick={handleAddCollab}
                    disabled={collabEmail === ""}
                    loading={isLoading || isFetching}
                >
                    Add Collaborator
                </Button>
            </Stack>
        </Paper>
    );
}

function ManageCollabs({ treeId }) {
    const [existingCollabs, setExistingCollabs] = useState(null);
    const [showSuccessNotification, setShowSuccessNotification] =
        useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [selectedCollabs, setSelectedCollabs] = useState([]);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get_existing_collaborators",
        queryFn: () => {
            return axios.get(
                `/api/family-tree-api/tree-members-b/get-collabs/${treeId}`
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

export default function AddCollabs({ treeId }) {
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
                <ManageCollabs treeId={treeId} />
            ) : (
                <AddWithEmail treeId={treeId} />
            )}
        </Paper>
    );
}
