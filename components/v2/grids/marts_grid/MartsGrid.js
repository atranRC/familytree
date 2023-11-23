import { Box, Group, Loader, Modal, Stack, Text } from "@mantine/core";
import MartPhotoFrame from "../../media_viewers/photo_viewers/mart_photo_frame/MartPhotoFrame";
import styles from "./martsGrid.module.css";
import { IconHome, IconHourglassEmpty, IconSearch } from "@tabler/icons";
import { useInfiniteQuery, useQuery } from "react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import MartyrViewer from "../../viewers/mart_viewer/MartyrViewer";
import Link from "next/link";
export default function MartsGrid() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMart, setSelectedMart] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);

    const docsQuery = useInfiniteQuery({
        queryKey: ["marts-grid", searchTerm],
        //enabled: false,
        refetchOnWindowFocus: false,
        queryFn: ({ pageParam = 1 }) => {
            return axios.get(
                `/api/marts/get-marts?p=${pageParam}&searchTerm=${searchTerm}`
            );
        },
        getNextPageParam: (lastPage, allPages) => {
            /*const maxPages = parseInt(lastPage.data.count / 10) + 1;
            const nextPage = allPages.length;
            console.log("bef", maxPages, nextPage, allPages.length);
            if (nextPage <= maxPages) {
                console.log(maxPages, nextPage, allPages.length);
                return true;
            } else {
                return undefined;
            }*/
            //return nextPage <= maxPages ? nextPage : undefined;
            return allPages.length + 1;
        },
        //getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    });

    useEffect(() => {
        let fetching = false;
        const onScroll = async (event) => {
            const { scrollHeight, scrollTop, clientHeight } =
                event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
                fetching = true;
                //console.log(docsQuery.hasNextPage);
                /*if (docsQuery.hasNextPage)*/ await docsQuery.fetchNextPage();

                fetching = false;
            }
        };

        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
    }, []);

    if (docsQuery.isError) return <div>ERROR</div>;

    return (
        <div className={styles.contBackground}>
            <div className={styles.navBar}>
                <Group>
                    <div className={styles.menuItem}>
                        <Link href="/" style={{ textDecoration: "none" }}>
                            home
                        </Link>
                    </div>
                    {/*<div className={styles.menuItem}>filter</div>
                    <div className={styles.menuItem}>about</div>*/}
                </Group>
                <input
                    className={styles.searchBar}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    placeholder="look for a martyr..."
                />
            </div>

            <div className={styles.cont}>
                {!docsQuery.isLoading ? (
                    docsQuery?.data?.pages.map((page) => {
                        if (page.data.count === 0) {
                            return (
                                <Stack
                                    spacing={0}
                                    align="center"
                                    justify="center"
                                >
                                    <IconHourglassEmpty
                                        opacity="0.5"
                                        size="50px"
                                    />{" "}
                                    <Text opacity="0.5" fz="lg">
                                        No results found
                                    </Text>{" "}
                                    <Text opacity="0.5">
                                        We are working on growing our list
                                        Please check back later
                                    </Text>
                                </Stack>
                            );
                        } else {
                            return page?.data?.docs.map((doc) => (
                                <MartPhotoFrame
                                    key={doc._id}
                                    mart={doc}
                                    onClick={() => {
                                        console.log("clicked frame");
                                        setSelectedMart(doc);
                                        setModalOpened(true);
                                    }}
                                />
                            ));
                        }
                    })
                ) : (
                    <Loader color="yellow" variant="dots" size="xl" />
                )}
            </div>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                size="auto"
            >
                <Box
                    sx={{
                        borderRadius: "5px",
                        backgroundImage: "rgb(255, 255, 255)",
                        backgroundImage:
                            "radial-gradient(circle, rgba(255, 255, 255, 1) 0%, #fabc3c 100%)",
                        boxShadow:
                            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                    }}
                >
                    <MartyrViewer mart={selectedMart} />
                </Box>
            </Modal>
        </div>
    );
}
