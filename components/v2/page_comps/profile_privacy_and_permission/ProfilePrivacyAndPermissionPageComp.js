import {
    Box,
    Button,
    Divider,
    Group,
    Modal,
    Paper,
    Stack,
    Switch,
    Text,
    Title,
    createStyles,
} from "@mantine/core";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import TreeMembershipsTable from "../../tables/trees_table/TreeMembershipsTable";
import TreeMembershipAuthorEditor from "../../editors/tree_editors/TreeMembershipAuthorEditor";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import {
    ProfileSettingsPageNotificationContext,
    ProfileSettingsPageProfileContext,
} from "../../../../contexts/profileSettingsPageContext";

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
    privacyCont: {
        display: "flex",
        flexDirection: "column",
        gap: "1em",
    },
    permissionCont: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1em",
    },
}));

export default function ProfilePrivacyAndPermissionPageComp() {
    const profile = useContext(ProfileSettingsPageProfileContext);
    const notify = useContext(ProfileSettingsPageNotificationContext);
    const [modalOpened, setModalOpened] = useState(false);
    const [treeMembershipToView, setTreeMembershipToView] = useState(null);

    const [isPrivate, setIsPrivate] = useState(
        profile?.data?.isPrivate || false
    );

    const router = useRouter();

    const { classes } = useStyles();
    const docsTreeMembershipsProfile = useQuery({
        queryKey: ["get_tree_memberships_profile", router.query.id],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            return axios.get(
                `/api/v2/fam-trees/get-by-tagged-user?taggedUser=${router.query.id}`
            );
        },
        /*enabled:
            sessionProfileRelation === "self" ||
            sessionProfileRelation === "owner",*/
        onSuccess: (res) => {
            // console.log("result2", res);
        },
    });

    const privacyMutation = useMutation({
        mutationFn: (owner) => {
            //console.log("body sent", form.values);
            if (profile.data.owner === "self") {
                console.log("editing self");
                return axios.put(`/api/users/v2/${profile.data._id}`, {
                    isPrivate: isPrivate,
                });
            }
            console.log("editing unclaimed");

            return axios.put(
                `/api/users/v2/edit-unclaimed?unclaimedProfileId=${profile.data._id}`,
                { isPrivate: isPrivate }
            );
        },
        onSuccess: (res) => {
            notify.success("your profile information has been updated");
            profile.refetch();
            //console.log("info update stage", res.data);
        },
        onError: () => {
            notify.error("could not update your profile information");
        },
    });

    const handleOnRowClick = (treeMembership) => {
        setTreeMembershipToView(treeMembership);
        setModalOpened(true);
    };

    if (docsTreeMembershipsProfile.isLoading) return <div>loading...</div>;

    return (
        <div className={classes.cont}>
            <div className={classes.privacyCont}>
                <Stack spacing={0}>
                    <Title>Privacy</Title>
                    <Text color="dimmed">Choose who can see this profile</Text>
                </Stack>
                <Paper withBorder p="xl" radius="1.5em">
                    <Stack>
                        <Switch
                            label="Make Profile Private"
                            description={
                                isPrivate
                                    ? "Only you and your family members can see this profile"
                                    : "Anyone can see this profile"
                            }
                            size="md"
                            checked={isPrivate}
                            onChange={(e) =>
                                setIsPrivate(e.currentTarget.checked)
                            }
                        />
                        <Button
                            sx={{ alignSelf: "flex-start" }}
                            radius="xl"
                            onClick={() => privacyMutation.mutate()}
                            disabled={isPrivate === profile.data.isPrivate}
                            loading={privacyMutation.isLoading}
                        >
                            Save
                        </Button>
                    </Stack>
                </Paper>
            </div>
            <Divider />

            <div className={classes.permissionCont}>
                <Stack spacing={0}>
                    <Title>Permissions</Title>
                    <Text color="dimmed">
                        Choose trees whose members can post Events and Stories
                        to this profile
                    </Text>
                </Stack>

                <TreeMembershipsTable
                    treeMemberships={docsTreeMembershipsProfile.data.data}
                    onRowClick={handleOnRowClick}
                />
            </div>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Introduce yourself!"
            >
                <TreeMembershipAuthorEditor
                    treeMembership={treeMembershipToView}
                />
            </Modal>
        </div>
    );
}
