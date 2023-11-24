import {
    ActionIcon,
    Button,
    Group,
    Modal,
    Pagination,
    Paper,
    Skeleton,
    Stack,
    Table,
    Text,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import { IconEye, IconMoodEmpty, IconPencil, IconTrash } from "@tabler/icons";
import styles from "./uploadedMarts.module.css";
import MartyrViewer from "../../viewers/mart_viewer/MartyrViewer";
import MartEditor from "../../editors/mart_editor/MartEditor";

export default function UploadedMarts({ sessionUserId }) {
    const [page, setPage] = useState(1);
    const [modalOpened, setModalOpened] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [modalMode, setModalMode] = useState("");

    const queryClient = useQueryClient();

    const docsQuery = useQuery({
        queryKey: ["user-uploaded-marts", page],
        //enabled: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            return axios.get(`/api/marts/get-marts/${sessionUserId}?p=${page}`);
        },
        onSuccess: (result) => {},
    });

    const docsMutate = useMutation({
        mutationFn: async () => {
            return axios.delete(`/api/marts/${rowSelected?._id}`, {
                data: rowSelected,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: "user-uploaded-marts" });
            setModalOpened(false);
        },
    });

    if (docsQuery.isError) return <div>ERROR</div>;
    if (docsQuery.isLoading)
        return (
            <Stack>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={12} radius="xl" />
                ))}
            </Stack>
        );

    return (
        <Paper p="md" withBorder>
            <Stack>
                <Table striped highlightOnHover withBorder>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Place of Birth</th>
                            <th>Place of Death</th>
                            <th>Born</th>
                            <th>Died</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docsQuery.data?.data?.data?.docs.map((doc) => {
                            return (
                                <tr key={doc._id}>
                                    <td>
                                        {doc?.firstName} {doc?.middleName}
                                    </td>
                                    <td>{doc?.birthplace?.value}</td>
                                    <td>{doc?.deathplace?.value}</td>
                                    <td>
                                        {moment(doc?.born).format("YYYY-MM-DD")}
                                    </td>
                                    <td>
                                        {moment(doc?.died).format("YYYY-MM-DD")}
                                    </td>
                                    <td>
                                        <Stack spacing={2} align="center">
                                            <ActionIcon
                                                size="sm"
                                                c="green"
                                                onClick={() => {
                                                    setRowSelected(doc);
                                                    setModalMode("view");
                                                    setModalOpened(true);
                                                }}
                                            >
                                                <IconEye />
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                c="blue"
                                                variant="transparent"
                                                onClick={() => {
                                                    setRowSelected(doc);
                                                    setModalMode("edit");
                                                    setModalOpened(true);
                                                }}
                                            >
                                                <IconPencil />
                                            </ActionIcon>
                                            <ActionIcon
                                                size="sm"
                                                c="red"
                                                onClick={() => {
                                                    setRowSelected(doc);
                                                    setModalMode("delete");
                                                    setModalOpened(true);
                                                }}
                                            >
                                                <IconTrash />
                                            </ActionIcon>
                                        </Stack>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {docsQuery.data?.data?.data?.pagination?.count === 0 && (
                    <Stack align="center" justify="center" spacing={0}>
                        <IconMoodEmpty opacity="0.5" size={30} />
                        <Text color="gray">
                            You have not added a martyr yet
                        </Text>
                    </Stack>
                )}
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={docsQuery.data?.data?.data?.pagination?.pageCount}
                    siblings={1}
                    initialPage={1}
                    position="center"
                />
            </Stack>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                size="lg"
            >
                {modalMode === "delete" && (
                    <Stack align="center">
                        <Text>Are you sure you want to proceed</Text>
                        <Text>
                            Selected Document{" "}
                            <Text
                                span
                                color="red"
                            >{`${rowSelected?.firstName} ${rowSelected?.middleName}`}</Text>
                        </Text>
                        <Group grow>
                            <Button
                                color="gray"
                                onClick={() => setModalOpened(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="red"
                                onClick={() => docsMutate.mutate()}
                                loading={docsMutate.isLoading}
                            >
                                Delete
                            </Button>
                        </Group>
                    </Stack>
                )}
                {modalMode === "view" && <MartyrViewer mart={rowSelected} />}
                {modalMode === "edit" && <MartEditor mart={rowSelected} />}
            </Modal>
        </Paper>
    );
}
