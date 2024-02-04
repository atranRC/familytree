import { ActionIcon, Badge, Paper, Stack, Switch, Table } from "@mantine/core";
import { IconEye, IconPencil } from "@tabler/icons";
import moment from "moment";

export default function TreeMembershipsTable({ treeMemberships, onRowClick }) {
    return (
        <Paper withBorder radius="1.5em" sx={{ overflowX: "auto" }}>
            <Table
                striped
                highlightOnHover
                withBorder
                horizontalSpacing="lg"
                verticalSpacing="md"
                fontSize="sm"
            >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Added</th>
                        <th>Allowed to post</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {treeMemberships.map((treeMembership) => {
                        return (
                            <tr key={treeMembership._id}>
                                <td>{treeMembership.treeName}</td>
                                <td>
                                    {treeMembership.createdAt ? (
                                        moment(treeMembership.createdAt).format(
                                            "YYYY-MM-DD"
                                        )
                                    ) : (
                                        <>-</>
                                    )}
                                </td>
                                <td>
                                    {treeMembership.canPost ? (
                                        <Badge color="green">allowed</Badge>
                                    ) : (
                                        <Badge color="red">not allowed</Badge>
                                    )}
                                </td>

                                <td>
                                    <ActionIcon
                                        size="sm"
                                        c="blue"
                                        variant="transparent"
                                        onClick={() => {
                                            onRowClick(treeMembership);
                                        }}
                                    >
                                        <IconEye color="blue" />
                                    </ActionIcon>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Paper>
    );
}
