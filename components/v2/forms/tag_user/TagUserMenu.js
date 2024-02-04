import {
    Button,
    Divider,
    Image,
    Paper,
    Stack,
    Tabs,
    Text,
    Title,
} from "@mantine/core";
import { useStyles } from "./TagUserMenuStyles";
import UserViewerV22 from "../../viewers/user_viewer/UserViewerV2";
import { useState } from "react";
import TagExistingUser from "./TagExistingUser";
import CreateUnclaimedProfile from "./CreateUnclaimedProfile";
import { useQuery } from "react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import TagUserMenuLoadingScreen from "../../../loading_screens/TagUserMenuLoadingScreen";
import RemoveTaggedUser from "./RemoveTaggedUser";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";
import {
    IconEye,
    IconPlus,
    IconTag,
    IconTrash,
    IconUserCircle,
    IconViewfinder,
} from "@tabler/icons";

export default function TagUserMenu({ treeId, balkanMemberId }) {
    //get session tree relationship
    //get treemember
    const { classes } = useStyles();
    const [tab, setTab] = useState("viewUser");
    const notifySuccess = (message) => toast.success(message);
    const notifyError = () => toast.error("Something went wrong");

    const treeMemberQuery = useQuery({
        queryKey: ["get_treemember_balkanid_treeid", treeId, balkanMemberId],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/family-tree-api/tree-members-b/v2/get-by-balkanid-treeid?treeId=${treeId}&balkanId=${balkanMemberId}`
            );
        },
        onSuccess: (res) => {},
        onError: (err) => {},
    });

    const sessionTreeRelationrQuery = useQuery({
        queryKey: ["get_session_tree_relation", treeId],
        refetchOnWindowFocus: false,
        queryFn: () => {
            return axios.get(
                `/api/v2/user-authorization/get-session-tree-relation?treeId=${treeId}`
            );
        },
        onSuccess: (res) => {},
        onError: (err) => {
            console.log(err);
        },
    });

    if (sessionTreeRelationrQuery.isLoading || treeMemberQuery.isLoading)
        return <TagUserMenuLoadingScreen />;

    return (
        <div className={classes.cont}>
            <div className={classes.horizontalTabs}>
                <Tabs
                    radius="md"
                    defaultValue="viewUser"
                    color="indigo"
                    value={tab}
                    onTabChange={setTab}
                >
                    <Tabs.List
                        //position="center"
                        sx={{
                            flexWrap: "nowrap",
                            overflow: "scroll",
                            padding: "5px",
                        }}
                    >
                        <Tabs.Tab value="viewUser">View Tagged User</Tabs.Tab>
                        <Tabs.Tab
                            value="tagExisting"
                            disabled={
                                !(
                                    sessionTreeRelationrQuery.data.data
                                        .isOwner ||
                                    sessionTreeRelationrQuery.data.data.isCollab
                                )
                            }
                        >
                            Tag Existing User
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="createUnclaimed"
                            // icon={<IconSettings size={14} />}
                            disabled={
                                !(
                                    sessionTreeRelationrQuery.data.data
                                        .isOwner ||
                                    sessionTreeRelationrQuery.data.data.isCollab
                                )
                            }
                        >
                            Create an Unclaimed Profile
                        </Tabs.Tab>

                        <Tabs.Tab
                            value="removeTagged"
                            // icon={<IconSettings size={14} />}
                            disabled={
                                !(
                                    sessionTreeRelationrQuery.data.data
                                        .isOwner ||
                                    sessionTreeRelationrQuery.data.data.isCollab
                                )
                            }
                            c="red"
                            color="red"
                        >
                            Remove Tagged User
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </div>
            <div className={classes.verticalTabs}>
                <Tabs
                    variant="pills"
                    orientation="vertical"
                    radius="md"
                    defaultValue="viewUser"
                    color="indigo"
                    value={tab}
                    onTabChange={setTab}
                >
                    <Tabs.List>
                        <Divider
                            color="darkgreen"
                            label="manage tagged user"
                            p={10}
                            labelPosition="center"
                        />
                        <Tabs.Tab value="viewUser" icon={<IconUserCircle />}>
                            View Tagged User
                        </Tabs.Tab>
                        <Tabs.Tab
                            icon={<IconTag />}
                            value="tagExisting"
                            disabled={
                                !(
                                    sessionTreeRelationrQuery.data.data
                                        .isOwner ||
                                    sessionTreeRelationrQuery.data.data.isCollab
                                )
                            }
                        >
                            Tag Existing User
                        </Tabs.Tab>
                        <Tabs.Tab
                            icon={<IconPlus />}
                            value="createUnclaimed"
                            // icon={<IconSettings size={14} />}
                            disabled={
                                !(
                                    sessionTreeRelationrQuery.data.data
                                        .isOwner ||
                                    sessionTreeRelationrQuery.data.data.isCollab
                                )
                            }
                        >
                            Create an Unclaimed Profile
                        </Tabs.Tab>
                        <Divider
                            color="red"
                            label="danger zone"
                            p={10}
                            labelPosition="center"
                        />
                        <Tabs.Tab
                            icon={<IconTrash />}
                            value="removeTagged"
                            // icon={<IconSettings size={14} />}
                            disabled={
                                !(
                                    sessionTreeRelationrQuery.data.data
                                        .isOwner ||
                                    sessionTreeRelationrQuery.data.data.isCollab
                                )
                            }
                            c="red"
                            color="red"
                        >
                            Remove Tagged User
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </div>
            <div className={classes.contentSection}>
                {tab === "viewUser" &&
                    (treeMemberQuery.data.data.taggedUser ? (
                        <UserViewerV22
                            userId={treeMemberQuery.data.data.taggedUser}
                        />
                    ) : (
                        <NoDataToShow message="No tagged user" />
                    ))}
                {tab === "tagExisting" && (
                    <TagExistingUser
                        treeMember={treeMemberQuery.data.data}
                        onSuccess={notifySuccess}
                        onError={notifyError}
                    />
                )}
                {tab === "createUnclaimed" && (
                    <CreateUnclaimedProfile
                        treeMember={treeMemberQuery.data.data}
                        onSuccess={notifySuccess}
                        onError={notifyError}
                    />
                )}
                {tab === "removeTagged" && (
                    <RemoveTaggedUser
                        treeMember={treeMemberQuery.data.data}
                        onSuccess={notifySuccess}
                        onError={notifyError}
                    />
                )}
            </div>
            <Toaster />
        </div>
    );
}
