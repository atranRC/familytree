import {
    ActionIcon,
    Badge,
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
import { getPillColorClaimReq, truncateWord } from "../../../../utils/utils";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";

export default function ClaimRequestsTable({ profileId, onRowClick }) {
    const [page, setPage] = useState(1);

    const docsQuery = useQuery({
        queryKey: ["get-claim-requests", profileId, page],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/claim-requests-api/v2/requests-for?profileId=${profileId}&page=${page}&pageSize=10`
            );
        },
        onSuccess: (res) => {
            //console.log("result2", res.data[0].data);
            //console.log("result2", res);
        },
    });

    if (docsQuery.isLoading) {
        return (
            <Paper withBorder p="md">
                <Stack justify="center" align="center" spacing="sm">
                    {Array.from({ length: 10 }).map((_, index) => {
                        return (
                            <Skeleton height="1rem" radius="xl" key={index} />
                        );
                    })}
                </Stack>
            </Paper>
        );
    }

    if (docsQuery.isError) return <div>error fetching...</div>;
    if (docsQuery.data.data[0].data.length === 0)
        return <NoDataToShow message={"No claim requests yet"} />;

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
                                    <th>Date</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docsQuery.data.data[0].data.map((doc) => {
                                    return (
                                        <tr
                                            key={doc._id}
                                            onClick={() => onRowClick(doc)}
                                        >
                                            <td>{doc?.claimerName}</td>
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
                                                {truncateWord(
                                                    doc?.message,
                                                    100
                                                )}
                                            </td>
                                            <td>
                                                <Badge
                                                    color={getPillColorClaimReq(
                                                        doc?.status
                                                    )}
                                                >
                                                    {doc?.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                        docsQuery.data.data[0].metadata[0].totalCount / 10,
                        10
                    ) + 1
                }
            />
        </Stack>
    );
}
