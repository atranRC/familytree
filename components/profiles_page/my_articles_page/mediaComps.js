import {
    CopyButton,
    Loader,
    Pagination,
    Paper,
    SimpleGrid,
    Stack,
    Button,
} from "@mantine/core";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import UploadWidget from "../../upload_widget/UploadWidget";

const imgLoader = ({ src }) => {
    return src;
};

export function MediaViewer({ media }) {
    return (
        <Stack align="center" justify="center">
            <Image
                loader={imgLoader}
                src={media.secureUrl}
                width={600}
                height={500}
                alt="img"
            />
        </Stack>
    );
}

export function MediaUploader({ uploaderId, folder }) {
    const [url, updateUrl] = useState();
    const [error, updateError] = useState();

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showUploaded, setShowUploaded] = useState(false);

    function handleOnUpload(error, result, widget) {
        if (error) {
            updateError(error);
            widget.close({
                quiet: true,
            });
            return;
        }

        if (result?.info?.secure_url) {
            console.log("heres the secure url", result);

            const bod = {
                ownerId: uploaderId,
                secureUrl: result.info.secure_url,
                thumbnail: result.info.thumbnail_url,
                tags: ["tag1", "tag2"],
            };

            axios
                .post("/api/article-static-media/", bod)
                .then(
                    (response) =>
                        console.log(
                            "success"
                        ) /* this.setState({ articleId: response.data.id })*/
                )
                .catch((error) => {
                    //this.setState({ errorMessage: error.message });
                    console.error("There was an error!");
                });
        }
    }

    return (
        <div>
            <UploadWidget onUpload={handleOnUpload} folder={folder}>
                {({ open }) => {
                    function handleOnClick(e) {
                        e.preventDefault();
                        open();
                    }
                    return (
                        <Button onClick={handleOnClick}>Upload Media</Button>
                    );
                }}
            </UploadWidget>
        </div>
    );
}

export function MediaThumbnailGrid({
    historianId,
    setSelectedMedia,
    setMediaViewerOpen,
}) {
    const [page, setPage] = useState(1);
    const [fetchedMedia, setFetchedMedia] = useState();

    const { isLoading, isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "get-user-thumbnail-grid",
        queryFn: () => {
            return axios.get(
                `/api/article-static-media/uploaded-by/${historianId}?p=${page}`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log("fetched media", d.data.data);
            setFetchedMedia(d.data.data);
        },
    });

    useEffect(() => {
        function refetchFun() {
            refetch();
        }
        refetchFun();
    }, [page, refetch]);

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (fetchedMedia) {
        return (
            <Stack>
                <Paper withBorder p="md">
                    <SimpleGrid
                        cols={4}
                        breakpoints={[
                            { maxWidth: "xs", cols: 2 },
                            { minWidth: "xs", cols: 2 },
                            { minWidth: "sm", cols: 3 },
                            { minWidth: "md", cols: 4 },
                        ]}
                    >
                        {fetchedMedia.media.map((m) => {
                            return (
                                <div
                                    key={m._id.toString()}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setSelectedMedia(m);
                                        setMediaViewerOpen(true);
                                    }}
                                >
                                    <Image
                                        loader={imgLoader}
                                        src={m.thumbnail}
                                        width={100}
                                        height={100}
                                        alt="img"
                                    />
                                </div>
                            );
                        })}
                    </SimpleGrid>
                </Paper>
                {fetchedMedia && (
                    <Pagination
                        page={page}
                        onChange={setPage}
                        total={fetchedMedia.pagination.pageCount}
                        siblings={1}
                        initialPage={1}
                        position="center"
                    />
                )}
            </Stack>
        );
    }
}
