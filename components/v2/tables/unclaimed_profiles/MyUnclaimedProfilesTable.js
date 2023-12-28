import {
    ActionIcon,
    Button,
    Group,
    MediaQuery,
    Pagination,
    Paper,
    ScrollArea,
    Skeleton,
    Stack,
    Table,
} from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";

export default function MyUnclaimedProfilesTable({ onRowClick }) {
    const [page, setPage] = useState(1);

    const docsUnclaimedProfiles = useQuery({
        queryKey: ["get-my-unclaimed-profiles", page],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/users/v2/my-unclaimed-profiles?page=${page}&pageSize=10`
            );
        },
        onSuccess: (res) => {
            console.log("result2", res.data[0].data);
        },
    });

    if (docsUnclaimedProfiles.isLoading) {
        return (
            <Paper withBorder p="md">
                <Stack justify="center" align="center" spacing="sm">
                    {Array.from({ length: 10 }).map((_, index) => {
                        return <Skeleton height="1rem" radius="xl" />;
                    })}
                </Stack>
            </Paper>
        );
    }

    return (
        <Stack spacing="sm">
            <ScrollArea style={{ width: "100%" }}>
                <MediaQuery
                    smallerThan="md"
                    styles={{ paddingRight: "0px", paddingLeft: "0px" }}
                >
                    <Paper p="md" withBorder>
                        <Table
                            striped
                            highlightOnHover
                            withBorder
                            horizontalSpacing="lg"
                            verticalSpacing="sm"
                            fontSize="md"
                        >
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Added</th>
                                    <th>Born</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docsUnclaimedProfiles.data.data[0].data.map(
                                    (doc) => {
                                        return (
                                            <tr key={doc._id}>
                                                <td>{doc.name}</td>
                                                <td>
                                                    {doc.createdAt ? (
                                                        moment(
                                                            doc.createdAt
                                                        ).format("YYYY-MM-DD")
                                                    ) : (
                                                        <>-</>
                                                    )}
                                                </td>
                                                <td>
                                                    {doc.birthday ? (
                                                        moment(
                                                            doc.birthday
                                                        ).format("YYYY-MM-DD")
                                                    ) : (
                                                        <>-</>
                                                    )}
                                                </td>

                                                <td>
                                                    <Group>
                                                        <ActionIcon
                                                            size="sm"
                                                            c="blue"
                                                            variant="transparent"
                                                            onClick={() => {
                                                                onRowClick(
                                                                    doc,
                                                                    "view"
                                                                );
                                                            }}
                                                        >
                                                            <IconEye color="teal" />
                                                        </ActionIcon>
                                                        {/*<ActionIcon
                                                            size="sm"
                                                            c="blue"
                                                            variant="transparent"
                                                            onClick={() => {
                                                                onRowClick(
                                                                    doc,
                                                                    "delete"
                                                                );
                                                            }}
                                                            disabled
                                                        >
                                                            <IconTrash color="red" />
                                                        </ActionIcon>*/}
                                                    </Group>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </Table>
                    </Paper>
                </MediaQuery>
            </ScrollArea>
            <Pagination
                page={page}
                onChange={setPage}
                total={
                    parseInt(
                        docsUnclaimedProfiles.data.data[0].metadata[0]
                            .totalCount / 10,
                        10
                    ) + 1
                }
            />
        </Stack>
    );
}
