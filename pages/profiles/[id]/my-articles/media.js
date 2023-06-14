import { Button, CopyButton, Loader, Modal, Stack, Title } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../../components/appShell";
import { ProfileTitleSection } from "../../../../components/titleSections";
import SecondaryNavbar from "../../../../components/profiles_page/SecondaryNavbar";
import {
    MediaThumbnailGrid,
    MediaUploader,
    MediaViewer,
} from "../../../../components/profiles_page/my_articles_page/mediaComps";
import Link from "next/link";

/*const Map = dynamic(() => import("../../../components/profiles_page/my_articles_page/mediaComps"), {
    ssr: false,
});*/

export default function MyArticlesMediaPage({ asPath }) {
    const { data: session, status } = useSession();
    const [sessionUser, setSessionUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [sessionProfileRelation, setSessionProfileRelation] = useState(null);

    const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState();

    const {
        isLoading: isLoadingSessionUser,
        isFetching: isFetchingSessionUser,
        data: dataSessionUser,
        refetch: refetchSessionUser,
        isError: isErrorSessionUser,
        error: errorSessionUser,
    } = useQuery({
        queryKey: "get-session-user-media-page",
        queryFn: () => {
            return axios.get("/api/users/users-mongoose/" + session.user.email);
        },
        enabled: session ? true : false,
        onSuccess: (d) => {
            //console.log("fetched session user", d.data.data);
            setSessionUser(d.data.data);
        },
    });

    const {
        isLoading: isLoadingProfileUser,
        isFetching: isFetchingProfileUser,
        data: dataProfileUser,
        refetch: refetchProfileUser,
        isError: isErrorProfileUser,
        error: errorProfileUser,
    } = useQuery({
        queryKey: "get-user-media-page",
        queryFn: () => {
            return axios.get("/api/users/" + asPath.split("/").at(-3));
        },
        enabled: false,
        onSuccess: (d) => {
            const pathUserId = asPath.split("/").at(-3);
            //console.log(pathUserId, sessionUser);
            setProfileUser(d.data.data);
            if (sessionUser && sessionUser._id) {
                if (sessionUser._id.toString() === pathUserId) {
                    setSessionProfileRelation("self");
                } else if (d.data.data.owner === sessionUser._id.toString()) {
                    setSessionProfileRelation("owner");
                }
            }
        },
    });

    /*useEffect(() => {
        if (!sessionUser) {
            setSessionUser(dataProfileUser?.data?.data);
            //refetchProfileUser();
        }
    }, [sessionUser]);*/
    useEffect(() => {
        function refetchProfileUserFun() {
            refetchProfileUser();
        }
        if (sessionUser) {
            refetchProfileUserFun();
        }
    }, [sessionUser, refetchProfileUser]);

    if (status === "unauthenticated") {
        return <Link href="/api/auth/signin">Sign in</Link>;
    }

    if (status === "loading" || !sessionProfileRelation) {
        console.log(status);
        return (
            <AppShellContainer>
                <Loader />
            </AppShellContainer>
        );
    }

    if (
        sessionProfileRelation === "self" ||
        sessionProfileRelation === "owner"
    ) {
        return (
            <AppShellContainer>
                <ProfileTitleSection picUrl={""}>
                    <Title order={2} fw={600}>
                        {dataProfileUser?.data?.data?.name}
                    </Title>
                    <Title order={5} fw={500}>
                        Articles Media
                    </Title>
                </ProfileTitleSection>
                <SecondaryNavbar
                    activePage={"media"}
                    id={asPath.split("/").at(-3)}
                    sessionProfileRelation={sessionProfileRelation}
                />
                <Stack p="md">
                    {dataSessionUser && (
                        <MediaUploader
                            uploaderId={dataProfileUser.data.data._id}
                            folder="/articles"
                        />
                    )}
                    {dataProfileUser && (
                        <MediaThumbnailGrid
                            historianId={dataProfileUser.data.data._id}
                            setSelectedMedia={setSelectedMedia}
                            setMediaViewerOpen={setMediaViewerOpen}
                        />
                    )}
                </Stack>
                <Modal
                    opened={mediaViewerOpen}
                    onClose={() => {
                        setMediaViewerOpen(false);
                    }}
                    title={
                        <CopyButton value={selectedMedia?.secureUrl}>
                            {({ copied, copy }) => (
                                <Button
                                    color={copied ? "teal" : "blue"}
                                    onClick={copy}
                                >
                                    {copied ? "URL Copied" : "Copy url"}
                                </Button>
                            )}
                        </CopyButton>
                    }
                    size="lg"
                    overflow="inside"
                >
                    {selectedMedia && <MediaViewer media={selectedMedia} />}
                </Modal>
            </AppShellContainer>
        );
    }
}

MyArticlesMediaPage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
