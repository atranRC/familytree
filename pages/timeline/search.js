import {
    Container,
    Divider,
    Paper,
    Skeleton,
    Stack,
    Title,
    Text,
    Group,
    Pagination,
    TextInput,
    Grid,
    Image,
    Box,
} from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PrimaryNavBar } from "../../components/timeline_page_comps/navbars/PublicTimelineNavbars";
import { Shell } from "../../components/wiki/Shell";

function Skeletons() {
    return (
        <Paper withBorder p="md">
            <Skeleton height={8} width="20%" radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Paper>
    );
}

function PreviewCard({ article }) {
    return (
        <Paper withBorder>
            <Grid grow>
                <Grid.Col span={8}>
                    <Stack spacing={10} p="md">
                        <Link
                            href={`/timeline?articleId=${article._id.toString()}`}
                        >
                            {article.title}
                        </Link>
                        <Text truncate>{article.description}</Text>
                        <Group>
                            <Text fz="sm" color="dimmed">
                                {article.authorName}
                            </Text>
                            <Divider orientation="vertical" />
                            <Text fz="sm" color="dimmed">
                                {article.date.split("T")[0]}
                            </Text>
                        </Group>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Image height="10rem" src={article.coverImage} />
                </Grid.Col>
            </Grid>
        </Paper>
    );
}

export default function TimelineSearchPage({ query }) {
    const [searchResultItems, setSearchResultItems] = useState([]);
    const [page, setPage] = useState(1);
    const [querySearchTerm, setQuerySearchTerm] = useState(query.searchTerm);

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "fetch-search-items",
        queryFn: () => {
            return axios.get(
                `/api/articles/search?searchTerm=${querySearchTerm}&p=${page}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            console.log("search items ", d.data.data);
            console.log("searching for", query.searchTerm);
            setSearchResultItems(d.data.data.articles);
        },
    });

    useEffect(() => {
        //console.log("effect searching for", query.searchTerm);
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [page, querySearchTerm, refetch]);
    return (
        <Shell>
            <Box sx={{ backgroundColor: "#F8F9FA" }}>
                {query.searchTerm && (
                    <Container>
                        <Stack>
                            <Stack spacing={0}>
                                <h1
                                    style={{
                                        marginBottom: "-5px",
                                        color: "gray",
                                    }}
                                >
                                    Search Results: {query.searchTerm}
                                </h1>
                                <Divider />
                            </Stack>
                            {searchResultItems.length > 0 ? (
                                searchResultItems.map((item) => {
                                    return (
                                        <PreviewCard
                                            key={item._id.toString()}
                                            article={item}
                                        />
                                    );
                                })
                            ) : (
                                <>
                                    <Skeletons />
                                    <Skeletons />
                                    <Skeletons />
                                    <Skeletons />
                                    <Skeletons />
                                </>
                            )}
                            {data && (
                                <Pagination
                                    mb="lg"
                                    page={page}
                                    onChange={setPage}
                                    total={data.data.data.pagination.pageCount}
                                    siblings={1}
                                    initialPage={1}
                                    position="center"
                                />
                            )}
                        </Stack>
                    </Container>
                )}
            </Box>
        </Shell>
    );
}

/*TimelineSearchPage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};*/

export async function getServerSideProps(context) {
    console.log(context.query);
    const query = {
        searchTerm: context.query.searchTerm,
        p: context.query.p ? context.query.p : "1",
    };
    return {
        props: {
            query,
        },
    };
}
