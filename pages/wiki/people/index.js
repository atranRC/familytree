import {
    Paper,
    Stack,
    Title,
    Text,
    Container,
    Button,
    Divider,
    MediaQuery,
} from "@mantine/core";
import { ShellWithAside } from "../../../components/wiki/ShellWithAside";
import {
    CardWikiList,
    SkeletonCardWikiList,
} from "../../../components/wiki/PreviewCards";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PeopleHome() {
    const [page, setPage] = useState(1);
    const [wikiList, setWikiList] = useState([]);
    const {
        isLoading: isLoadingWikiList,
        isFetching: isFetchingWikiList,
        data: dataWikiList,
        refetch: refetchWikiList,
        isError: isErrorWikiList,
        error: errorWikiList,
    } = useQuery({
        queryKey: "get_wiki_list_for_people_home",
        queryFn: () => {
            return axios.get(`/api/wikis/get-list/people?p=${page}`);
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("hehe by ", d.data.data.wikis);
            let newList = wikiList;
            setWikiList(newList.concat(d.data.data.wikis));
        },
    });

    const handleShowMore = () => {
        setPage(page + 1);
    };

    useEffect(() => {
        function refetchWikiListFun() {
            refetchWikiList();
        }
        refetchWikiListFun();
    }, [page, refetchWikiList]);

    return (
        <ShellWithAside page="people">
            <Stack align="center">
                <Paper
                    p="md"
                    style={{
                        width: "100%",
                        height: "40vh",
                        backgroundImage:
                            "url(https://richmix.org.uk/wp-content/uploads/2022/12/image00138-1308x872.jpg)",
                        backgroundPositionY: "center",
                        //background:
                        //  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,36,36,1) 0%, rgba(255,244,0,0.8772939617714185) 100%, rgba(255,0,0,0.5767321640186096) 100%)",
                    }}
                >
                    <div style={{ width: "35%", height: "100%" }}>
                        <Stack spacing={0}>
                            <Title fw={700} size={100} c="white">
                                People.
                            </Title>
                            <Text pl="xs" fz="lg" c="white">
                                A Place to Celebrate the Everyday Heroes of
                                Tigray
                            </Text>
                        </Stack>
                    </div>
                </Paper>
                {(isFetchingWikiList || isLoadingWikiList) &&
                    wikiList.length < 1 && <SkeletonCardWikiList />}
                {wikiList.length < 1 &&
                    (isFetchingWikiList || isLoadingWikiList) && (
                        <div>nothing here</div>
                    )}
                {wikiList.length > 0 && (
                    <MediaQuery smallerThan="lg" styles={{ width: "100%" }}>
                        <Stack w="75%">
                            {wikiList.map((wiki) => {
                                return (
                                    <div key={wiki._id}>
                                        <CardWikiList
                                            id={wiki._id}
                                            title={wiki.title}
                                            description={wiki.description}
                                            tag={wiki.tag}
                                            coverImage={wiki.coverImage}
                                        />
                                        <Divider />
                                    </div>
                                );
                            })}

                            <Button
                                //disabled={isFetchingWikiList}
                                loading={isFetchingWikiList}
                                onClick={handleShowMore}
                            >
                                Show More
                            </Button>
                        </Stack>
                    </MediaQuery>
                )}
            </Stack>
        </ShellWithAside>
    );
}
