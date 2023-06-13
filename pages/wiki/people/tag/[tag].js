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
import { ShellWithAside } from "../../../../components/wiki/ShellWithAside";
import {
    CardWikiList,
    SkeletonCardWikiList,
} from "../../../../components/wiki/PreviewCards";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { IconTags } from "@tabler/icons";
import { useRouter } from "next/router";

export default function PeopleTagHome() {
    const router = useRouter();
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
        queryKey: "get_wiki_list_for_people_tag",
        queryFn: () => {
            return axios.get(
                `/api/wikis/get-list/${router.query.tag}?p=${page}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("hehe by ", d.data.data.wikis);
            let newList = wikiList;
            setWikiList(newList.concat(d.data.data.wikis));
        },
    });

    const getPageCoverImage = () => {
        if (router.query.tag === "hero") {
            return "url(https://c8.alamy.com/comp/HM3Y6M/three-firefighters-battle-a-blaze-HM3Y6M.jpg)";
        }
        if (router.query.tag === "martyr") {
            return "url(https://mediaim.expedia.com/destination/2/969ac153dfbf9953fe8d1a239ac6063e.jpg)";
        }
        if (router.query.tag === "public_figure") {
            return "url(https://i.pinimg.com/originals/af/c5/02/afc50234514d5a77c5487bb93f2613cc.jpg)";
        }
    };

    const handleShowMore = () => {
        setPage(page + 1);
    };

    useEffect(() => {
        function refetchWikiListFun() {
            refetchWikiList();
        }
        refetchWikiListFun();
    }, [page]);

    return (
        <ShellWithAside page="people">
            <Stack align="center">
                <Paper
                    p="md"
                    style={{
                        width: "100%",
                        height: "40vh",
                        backgroundImage: getPageCoverImage(),
                        backgroundPositionY: "center",
                        //background:
                        //  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(255,36,36,1) 0%, rgba(255,244,0,0.8772939617714185) 100%, rgba(255,0,0,0.5767321640186096) 100%)",
                    }}
                >
                    <div style={{ width: "35%", height: "100%" }}>
                        <Stack spacing={0}>
                            <Title fw={700} size={100} c="white">
                                #{router.query.tag}
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

PeopleTagHome.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
