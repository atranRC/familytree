//api/user-upload-media/attached-media/645b8d59840158d8e7e27fe7?p=1&eventOrStory=story

import { useMutation, useQuery, useQueryClient } from "react-query";
import UserMediaUploader from "../media_upload/UserMediaUploader";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Group,
    Modal,
    Pagination,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Notification,
} from "@mantine/core";
import { getSecUrl, getThumbUrl } from "../../../utils/cloudinaryUtils";
import { Gallery } from "react-grid-gallery";
import { Image } from "@mantine/core";
import { IconCheck, IconTrash } from "@tabler/icons";
//import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
    ssr: false,
});

//story or evnet id, event or story
export default function EventOrStoryMediaViewer({
    sessionProfileRelation,
    profileUser,
    sessionUser,
    eventOrStoryId,
    eventOrStory,
}) {
    const [page, setPage] = useState(1);
    const [images, setImages] = useState();
    const [selectedImage, setSelectedImage] = useState();
    const [imageModalOpened, setImageModalOpened] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [deletedAlert, setDeletedAlert] = useState(false);

    const queryClient = useQueryClient();

    const docsQuery = useQuery({
        queryKey: ["user-uploaded-media", eventOrStoryId, page],
        //enabled: false,
        queryFn: async () => {
            return axios.get(
                `/api/user-upload-media/attached-media/${eventOrStoryId}?p=${page}&eventOrStory=${eventOrStory}`
            );
        },
        onSuccess: (result) => {
            const fetchedImages = result.data?.data?.media.map((m) => {
                return {
                    src: getThumbUrl(m.cloudinaryParams),
                    width: 320,
                    height: 212,
                    cloudinaryParams: m.cloudinaryParams,
                    dbId: m._id,
                    //caption: "Boats (Jeshu John - designerspics.com)",
                };
            });
            setImages(fetchedImages);
        },
    });

    const handleSelect = (index) => {
        const nextImages = images.map((image, i) =>
            i === index ? { ...image, isSelected: !image.isSelected } : image
        );
        setImages(nextImages);
    };

    const handleSelectAllClick = () => {
        const nextImages = images.map((image) => ({
            ...image,
            isSelected: !images?.some((image) => image.isSelected),
        }));
        setImages(nextImages);
    };

    const handleImageClick = (index) => {
        setSelectedImage(getSecUrl(images[index].cloudinaryParams));
        setImageModalOpened(true);
    };

    const handleDelete = useMutation({
        mutationFn: () => {
            let dbIdArray = [];
            let cloudinaryIdArray = [];
            images.map((image) => {
                if (image.isSelected) {
                    dbIdArray.push(image.dbId);
                    cloudinaryIdArray.push(image.cloudinaryParams.public_id);
                }
            });
            return axios.delete("/api/user-upload-media", {
                data: {
                    dbIds: dbIdArray,
                    cloudinaryIds: cloudinaryIdArray,
                    eventOrStory: eventOrStory,
                },
            });
        },
        onSuccess: (data) => {
            setDeletedAlert(true);
            setDeleteModalOpened(false);
            queryClient.invalidateQueries({
                queryKey: ["user-uploaded-media", eventOrStoryId],
            });
        },
    });

    if (docsQuery.isLoading) return <div>loading...</div>;
    if (docsQuery.isError) return <div>ERROR</div>;

    return (
        <Stack>
            <Title className="storyTitle" align="center" color="darkgreen">
                Photos
            </Title>
            {docsQuery.data?.data?.result === "NO_DATA" && (
                <Stack align="center" justify="center">
                    <ThemeIcon
                        variant="default"
                        radius="xl"
                        size="xl"
                        color="gray"
                    >
                        🙁
                    </ThemeIcon>
                    <Text c="dimmed">No photos posted</Text>
                </Stack>
            )}
            {images && (
                <Button.Group>
                    <Button
                        compact
                        color="green"
                        onClick={handleSelectAllClick}
                    >
                        {images?.some((image) => image.isSelected)
                            ? "Clear"
                            : "Select all"}
                    </Button>
                    <Button
                        compact
                        color="red"
                        leftIcon={<IconTrash size={18} />}
                        disabled={!images?.some((image) => image.isSelected)}
                        onClick={() => setDeleteModalOpened(true)}
                    >
                        Delete
                    </Button>
                </Button.Group>
            )}
            <Gallery
                images={images}
                onSelect={handleSelect}
                onClick={handleImageClick}
            />
            {images && (
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={docsQuery.data?.data?.data?.pagination?.pageCount}
                    siblings={1}
                    initialPage={1}
                    position="center"
                />
            )}
            {deletedAlert && (
                <Notification
                    icon={<IconTrash size={18} />}
                    color="teal"
                    title="Delete Successful"
                    onClose={() => setDeletedAlert(false)}
                >
                    Photos deleted successfully
                </Notification>
            )}
            <UserMediaUploader
                uploaderId={sessionUser}
                profileId={profileUser}
                eventOrStory={eventOrStory}
                eventOrStoryId={eventOrStoryId}
            />

            {/*<Modal
                opened={imageModalOpened}
                onClose={() => setImageModalOpened(false)}
                //title="This is fullscreen modal!"
                size="auto"
                overflow="inside"
            >
                <Image src={selectedImage} alt="img" />
            </Modal>*/}
            <Lightbox
                open={imageModalOpened}
                close={() => setImageModalOpened(false)}
                slides={[{ src: selectedImage }]}
            />
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Confirm Delete"
                size="auto"
            >
                <Stack align="center" justify="center" spacing="sm">
                    <Text>Are you sure you want to delete photos</Text>
                    <Text color="red">This action can not be undone</Text>
                    <Group grow>
                        <Button
                            color="red"
                            onClick={() => handleDelete.mutate()}
                            loading={handleDelete.isLoading}
                        >
                            Delete
                        </Button>
                        <Button
                            color="gray"
                            onClick={() => setDeleteModalOpened(false)}
                        >
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    );
}
