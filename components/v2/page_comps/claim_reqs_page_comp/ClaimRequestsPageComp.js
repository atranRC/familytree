import { useContext, useState } from "react";
import {
    ProfileSettingsPageNotificationContext,
    ProfileSettingsPageProfileContext,
} from "../../../../contexts/profileSettingsPageContext";
import { Box, Modal, Stack, Text, Title, createStyles } from "@mantine/core";
import ClaimRequestsTable from "../../tables/claim_requests_table/ClaimRequestsTable";
import ClaimRequestApproveOrDecline from "../../decision_comps/ClaimRequestApproveOrDecline";

const useStyles = createStyles((theme) => ({
    cont: {
        width: "100%",
        //height: "100vh",
        //border: "1px solid #E8E8E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        padding: "5px",
        gap: "2em",
    },
    claimCont: {
        maxWidth: "100%",
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        gap: "1em",
    },
}));

export default function ClaimRequestsPageComp() {
    const profile = useContext(ProfileSettingsPageProfileContext);
    const notify = useContext(ProfileSettingsPageNotificationContext);
    const [modalOpened, setModalOpened] = useState(false);
    const [claimReqToView, setClaimReqToView] = useState(null);
    const { classes } = useStyles();
    return (
        <div className={classes.claimCont}>
            <Stack spacing={0}>
                <Title>Claim Requests</Title>
                <Text color="dimmed">Claim Requests for this profile</Text>
            </Stack>

            <ClaimRequestsTable
                profileId={profile.data._id}
                onRowClick={(d) => {
                    setClaimReqToView(d);
                    setModalOpened(true);
                }}
            />

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
                        notify.success("Claim request approved.");
                        setModalOpened(false);
                    }}
                    onDeclineSuccess={() => {
                        notify.success("Claim request declined.");
                        setModalOpened(false);
                    }}
                    onError={() => notify.error("Something went wrong.")}
                />
            </Modal>
        </div>
    );
}
