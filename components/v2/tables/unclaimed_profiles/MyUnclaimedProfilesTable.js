import {
    ActionIcon,
    Box,
    Button,
    Group,
    Loader,
    MediaQuery,
    Pagination,
    Paper,
    ScrollArea,
    Skeleton,
    Stack,
    Table,
    TextInput,
} from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import TableLoading from "../../loading_screens/table_loading/TableLoading";

export default function MyUnclaimedProfilesTable({ onRowClick }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const docsUnclaimedProfiles = useQuery({
        queryKey: ["get-my-unclaimed-profiles", page, searchTerm],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/users/v2/my-unclaimed-profiles?&searchTerm=${searchTerm}&page=${page}&pageSize=10`
            );
        },
        onSuccess: (res) => {
            console.log("result2", res?.data[0]?.data);
        },
    });

    /*if (docsUnclaimedProfiles.isLoading) {
        return <TableLoading size={10} />;
    }*/

    return (
        <Stack spacing="sm">
            <TextInput
                value={searchTerm}
                onChange={(event) => {
                    setPage(1);
                    setSearchTerm(event.currentTarget.value);
                }}
                placeholder="Search Unclaimed Profiles ..."
                radius="xl"
                size="md"
                width="100%"
            />
            {docsUnclaimedProfiles.isLoading && <Loader size="sm" />}
            <ScrollArea style={{ width: "100%" }}>
                <MediaQuery
                    smallerThan="md"
                    styles={{ paddingRight: "0px", paddingLeft: "0px" }}
                >
                    <Box p="xl">
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
                                    {docsUnclaimedProfiles.data?.data[0]?.data.map(
                                        (doc) => {
                                            return (
                                                <tr key={doc._id}>
                                                    <td>{doc.name}</td>
                                                    <td>
                                                        {doc.createdAt ? (
                                                            moment(
                                                                doc.createdAt
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
                                                        ) : (
                                                            <>-</>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {doc.birthday ? (
                                                            moment(
                                                                doc.birthday
                                                            ).format(
                                                                "YYYY-MM-DD"
                                                            )
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
                    </Box>
                </MediaQuery>
            </ScrollArea>

            {docsUnclaimedProfiles?.data?.data[0]?.data && (
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={
                        parseInt(
                            docsUnclaimedProfiles.data?.data[0]?.count / 10
                        ) + 1
                    }
                    radius="md"
                    withEdges
                />
            )}
        </Stack>
    );
}
