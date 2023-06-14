//check session
//check sessionArticleRelation
//pass sessionArticleRelation as page prop

import {
    Badge,
    Container,
    createStyles,
    Divider,
    Group,
    MediaQuery,
    Pagination,
    Paper,
    Table,
    Title,
} from "@mantine/core";
import axios from "axios";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import dbConnect from "../../../../../lib/dbConnect";
import Users from "../../../../../models/Users";
import { authOptions } from "../../../../api/auth/[...nextauth]";
import { Text } from "@mantine/core";
import { DraftsTableSkeleton } from "../../../../../components/profiles_page/my_articles_page/cards";
import AppShellContainer from "../../../../../components/appShell";
import { ProfileTitleSection } from "../../../../../components/titleSections";
import SecondaryNavbar from "../../../../../components/profiles_page/SecondaryNavbar";

export default function MyArticledraftsPage({ sessionUserJson }) {
    const router = useRouter();
    const id = router.query.id;

    const useStyles = createStyles((theme) => ({
        draftLink: {
            textDecoration: "none",
            color: "blue",
            cursor: "pointer",
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
            },
        },
    }));
    const { classes } = useStyles();

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    //fetch drafts by sessionUserJson._id
    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-drafts-by",
        queryFn: () => {
            return axios.get(
                "/api/article-drafts/articledrafts-by/" +
                    sessionUserJson._id +
                    "?p=" +
                    page
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("drafts by ", d.data.data);
        },
    });

    const rows =
        data &&
        data.data.data.articledrafts.map((r) => {
            let color = "yellow";
            let status = "In draft";
            if (r.articleId) {
                color = "green";
                status = "published";
            }

            return (
                <tr key={r._id.toString()}>
                    <td>{r.title}</td>
                    <td>{r.date.toString()}</td>
                    <td>
                        <Text truncate>{r.description}</Text>
                    </td>
                    <td>
                        <Badge color={color}>{status}</Badge>
                    </td>
                    <td>
                        <span className={classes.draftLink}>preview</span>
                        <Divider orientation="vertical" />
                        <span
                            className={classes.draftLink}
                            onClick={() => {
                                router.push(
                                    `/profiles/${sessionUserJson._id}/my-articles/drafts/${r._id}`
                                );
                            }}
                        >
                            edit
                        </span>
                    </td>
                </tr>
            );
        });

    useEffect(() => {
        if (data) {
            setPageCount(data.data.data.pagination.pageCount);
        }
    }, [data]);

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [page, refetch]);

    if (id !== sessionUserJson._id) {
        return <div>RESTRICTED PAGE</div>;
    }

    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {sessionUserJson.name}
                </Title>
                <Title order={5} fw={500}>
                    Drafts
                </Title>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"drafts"}
                id={id}
                sessionProfileRelation={"self"}
            />
            <MediaQuery
                smallerThan="sm"
                styles={{ paddingleft: "0px", paddingRight: "0px" }}
            >
                <Container pt="md">
                    <Title p="md" c="dimmed">
                        All Drafts
                    </Title>
                    {isLoading || isFetching ? (
                        <Group grow>
                            <DraftsTableSkeleton />
                            <DraftsTableSkeleton />
                            <DraftsTableSkeleton />
                            <DraftsTableSkeleton />
                        </Group>
                    ) : (
                        <>
                            {data ? (
                                <Paper p="sm" withBorder>
                                    <div
                                        style={{
                                            overflowX: "auto",
                                        }}
                                    >
                                        <Table
                                            striped
                                            highlightOnHover
                                            withBorder
                                            bg="white"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Date</th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>{rows}</tbody>
                                        </Table>
                                    </div>
                                    <Pagination
                                        page={page}
                                        mt="md"
                                        onChange={setPage}
                                        total={
                                            data.data.data.pagination.pageCount
                                        }
                                        siblings={1}
                                        initialPage={1}
                                        position="center"
                                    />
                                </Paper>
                            ) : (
                                <>no data available</>
                            )}
                        </>
                    )}
                </Container>
            </MediaQuery>
        </AppShellContainer>
    );
}

export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    //fetch session user
    console.log("article-drafts", context.query.id);
    await dbConnect();

    const sessionUser = await Users.findOne({ email: session.user.email });
    const sessionUserJson = JSON.parse(JSON.stringify(sessionUser));

    return {
        props: {
            session,
            sessionUserJson,
            //sessionUserCanPost,
            //allReqs2,
            //profileData,
            //allUsersData,
            //ownerData,
            //treesData,
            //treesImInData2,
            //myCollabsTrees2,
        },
    };
}
