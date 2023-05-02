import {
    Button,
    Group,
    Loader,
    Radio,
    Stack,
    TextInput,
    Title,
} from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";

export function EditTree({ treeId }) {
    const router = useRouter();
    const [treeName, setTreeName] = useState("");
    const [treeNameError, setTreeNameError] = useState(false);
    const [treeDescription, setTreeDescription] = useState("");
    const [treePrivacyValue, setTreePrivacyValue] = useState("");

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get-tree",
        queryFn: () => {
            return axios.get("/api/family-tree-api/" + treeId);
        },
        onSuccess: (d) => {
            console.log("update data fetched", d.data.data);
            setTreeName(d.data.data.tree_name);
            setTreeDescription(d.data.data.description);
            setTreePrivacyValue(d.data.data.privacy);
        },
        onError: () => {
            console.log("iddddds");
        },
    });

    const {
        isLoading: isLoadingUpdate,
        isFetching: isFetchingUpdate,
        data: dataUpdate,
        refetch: refetchUpdate,
        isError: isErrorUpdate,
        error: errorUpdate,
    } = useQuery({
        queryKey: "update-tree",
        queryFn: () => {
            const updateBod = {
                tree_name: treeName,
                description: treeDescription,
                privacy: treePrivacyValue,
            };
            return axios.patch("/api/family-tree-api/" + treeId, updateBod);
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("tree updated", d.data.data);
            router.refresh();
        },
        onError: () => {
            console.log("iddddds");
        },
    });

    const handleUpdateTree = () => {
        if (treeName === "") {
            setTreeNameError(true);
        } else {
            refetchUpdate();
        }
    };

    return (
        <>
            {data ? (
                <Stack justify="center" align="center" spacing={3}>
                    <TextInput
                        w={300}
                        placeholder="name of your new tree"
                        label="Tree Name"
                        withAsterisk
                        value={treeName}
                        onChange={(e) => setTreeName(e.target.value)}
                        error={treeNameError}
                        onFocus={() => setTreeNameError(false)}
                    />
                    <TextInput
                        w={300}
                        placeholder="describe your tree"
                        value={treeDescription}
                        label="Tree Description"
                        onChange={(e) => setTreeDescription(e.target.value)}
                    />
                    <Radio.Group
                        name="privacy"
                        value={treePrivacyValue}
                        onChange={setTreePrivacyValue}
                    >
                        <Radio value="public" label="Public" />
                        <Radio value="private" label="Private" />
                    </Radio.Group>
                    <Button
                        w={300}
                        variant="outline"
                        onClick={handleUpdateTree}
                        loading={isFetchingUpdate || isLoadingUpdate}
                    >
                        Update Tree
                    </Button>
                </Stack>
            ) : (
                <Loader />
            )}
        </>
    );
}

export function DeleteTree({ treeId, setConfirmDeleteOpened, treeName }) {
    //const [buttonDisabled, setButtonDisabled] = useState(false)
    const router = useRouter();
    const {
        isLoading: isLoadingDelete,
        isFetching: isFetchingDelete,
        data: dataDelete,
        refetch: refetchDelete,
        isError: isErrorDelete,
        error: errorDelete,
    } = useQuery({
        queryKey: "delete-tree-v2",
        queryFn: () => {
            return axios.delete(`/api/family-tree-api/${treeId}`);
        },
        enabled: false,
        onSuccess: (d) => {
            router.push("/family-tree/tree/my-trees");
        },
    });

    const handleTreeDelete = () => {
        refetchDelete();
    };

    return (
        <Stack spacing="md" align="center" justify="center">
            <Title order={5} fw={500}>
                Are you sure you want to delete {treeName} ?
            </Title>
            <Group>
                <Button onClick={() => setConfirmDeleteOpened(false)}>
                    Cancel
                </Button>
                <Button
                    loading={isLoadingDelete || isFetchingDelete}
                    color="red"
                    onClick={handleTreeDelete}
                    //disabled={buttonDisabled}
                >
                    Delete
                </Button>
            </Group>
        </Stack>
    );
}
