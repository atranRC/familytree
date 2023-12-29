import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import AppShellContainer from "../../../components/appShell";
import { ProfileTitleSection } from "../../../components/titleSections";
import { Container, MediaQuery, Modal, Stack, Title } from "@mantine/core";
import SecondaryNavbar from "../../../components/profiles_page/SecondaryNavbar";
import ProfileLoadingScreen from "../../../components/v2/loading_screens/profile_loading/ProfileLoadingScreen";
import ClaimRequestsTable from "../../../components/v2/tables/claim_requests_table/ClaimRequestsTable";
import ClaimRequestApproveOrDecline from "../../../components/v2/decision_comps/ClaimRequestApproveOrDecline";
import toast, { Toaster } from "react-hot-toast";

export default function ClaimReqsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sessionProfileRelation, setSessionProfileRelation] = useState(null);

    const notifyApproveSuccess = () => toast.success("Request Approved");
    const notifyDeclinedSuccess = () => toast.success("Request declined");
    const notifyError = () => toast.error("Something went wrong");

    const [modalOpened, setModalOpened] = useState(false);
    const [claimReqToView, setClaimReqToView] = useState(null);

    const docsSessionProfileRelation = useQuery({
        queryKey: ["get_session_profile_relation", router.query.id],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            return axios.get(
                `/api/v2/user-authorization/get-session-profile-relation?profileId=${router.query.id}`
            );
        },
        enabled: !!session && !!router.query.id,
        onSuccess: (res) => {
            //console.log("result", res.data);
            setSessionProfileRelation(res.data.sessionProfileRelation);
        },
    });

    const docsSessionCanPost = useQuery({
        //add profile id to query key
        queryKey: ["get_session_can_post", router.query.id],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            return axios.get(
                `/api/v2/user-authorization/get-session-can-post?profileId=${router.query.id}`
            );
        },
        enabled: sessionProfileRelation === "none",
        onSuccess: (res) => {
            console.log("sessioncanpost", res.data);
            setSessionProfileRelation(res.data ? "canPost" : "noPost");
        },
    });

    if (status === "unauthenticated") return <div>Not logged in</div>;
    /*if (status === "loading")
        return <ProfileLoadingScreen>loading session...</ProfileLoadingScreen>;*/
    if (
        status === "loading" ||
        docsSessionProfileRelation.isLoading ||
        docsSessionCanPost.isLoading
    )
        return <ProfileLoadingScreen>loading relation...</ProfileLoadingScreen>;

    if (
        sessionProfileRelation === "none" ||
        sessionProfileRelation === "noPost"
    )
        return <div>UNAUTHORISED</div>;

    return (
        <AppShellContainer>
            <ProfileTitleSection picUrl={""}>
                <Title order={2} fw={600}>
                    {docsSessionProfileRelation.data.data.profile.name}
                </Title>
                <Title order={5} fw={500}>
                    Claim Requests
                </Title>
                <div>{sessionProfileRelation}</div>
            </ProfileTitleSection>
            <SecondaryNavbar
                activePage={"claim-requests"}
                id={router.query.id}
                sessionProfileRelation={sessionProfileRelation}
            />
            <MediaQuery
                smallerThan="sm"
                styles={{ padding: "0px", paddingTop: "10px" }}
            >
                <Container pt="md">
                    <Stack spacing="sm">
                        <MediaQuery
                            smallerThan="sm"
                            styles={{ fontSize: "1.5rem", padding: "0px" }}
                        >
                            <Title color="gray" mt="md">
                                {`Claim Requests for ${docsSessionProfileRelation.data.data.profile.name}'s profile:`}
                            </Title>
                        </MediaQuery>
                        <ClaimRequestsTable
                            profileId={router.query.id}
                            onRowClick={(d) => {
                                setClaimReqToView(d);
                                setModalOpened(true);
                            }}
                        />
                    </Stack>
                </Container>
            </MediaQuery>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                radius="xl"
                padding="xs"
                withCloseButton={false}
                closeOnClickOutside={false}
            >
                <ClaimRequestApproveOrDecline
                    claimRequest={claimReqToView}
                    onClose={() => setModalOpened(false)}
                    onApproveSuccess={() => {
                        notifyApproveSuccess();
                        setModalOpened(false);
                    }}
                    onDeclineSuccess={() => {
                        notifyDeclinedSuccess();
                        setModalOpened(false);
                    }}
                    onError={() => notifyError()}
                />
            </Modal>
            <Toaster />
        </AppShellContainer>
    );
}
