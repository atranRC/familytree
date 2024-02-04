import {
    Button,
    Container,
    Modal,
    Progress,
    Radio,
    TextInput,
    Textarea,
    Title,
    createStyles,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import LocationAutocompleteV2 from "../../components/v2/location/location_autocomplete/LocationAutoCompleteV2";
import { useState } from "react";
import {
    IconBallon,
    IconGenderFemale,
    IconGenderMale,
    IconWritingSign,
} from "@tabler/icons";
import NewUserForm from "../../components/v2/forms/new_user/NewUserForm";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import UnclaimedProfilesList from "../../components/v2/lists/unclaimed_profiles/UnclaimedProfilesList";
import Searching from "../../components/v2/loading_screens/Searching";
import NewUserIntroductionModal from "../../components/v2/help/NewUserIntroductionModal";
import InvitationsListsV2 from "../../components/v2/lists/invitations/InvitationsListsV2";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import TigrayWikiLogo from "../../components/TigrayWikiLogo";

export const useStyles = createStyles((theme) => ({
    root: {
        //border: "1px solid #E8E8E8",
        minHeight: "100vh",
        backgroundImage:
            "linear-gradient(to right top, #ff163f, #ff6829, #ff9f17, #ffd127, #ffff55)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    bgImage: {
        position: "absolute",
        //border: "1px solid red",
        minHeight: "100%",
        width: "100%",
        backgroundImage: "url('/statics/new_user_bg.jpg')",
        opacity: "0.5",
    },

    cont: {
        //position: "absolute",
        //border: "1px solid red",

        width: "100%",
        //overflowY: "auto",
        paddingLeft: "5em",
        paddingRight: "5em",
        paddingTop: "2em",
        paddingBottom: "2em",
        display: "flex",
        flexDirection: "column",
        //justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        "@media (max-width: 800px)": {
            paddingLeft: "0px",
            paddingRight: "0px",
            //width: "100%",
        },
    },

    nameSection: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1em",
    },
    sexSection: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    locationSection: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1em",
    },
    location: {
        flexGrow: 1,
    },
    miscSection: { display: "flex", flexWrap: "wrap", gap: "1em" },
}));
export default function NewUserPageV2() {
    const { data: session, status } = useSession();
    const [viewMode, setViewMode] = useState("form");
    const [showIntroModal, setShowIntroModal] = useState(true);

    const notifySuccess = (message) => toast.success(message);
    const notifyError = (message) => toast.error(message);

    const form = useForm({
        initialValues: {
            name: "",
            fathers_name: "",
            last_name: "",
            sex: "",
            birthday: null,
            birth_place: null,
            current_residence: null,
            nicknames: "",
            shortBio: "",
            owner: "self",
            /*isHistorian: false,
            isBlocked: false,
             isPrivate*/
        },

        validate: {
            name: (value) =>
                value.length < 2 || value.length > 40
                    ? "Please enter a valid name"
                    : null,
            sex: (value) => (value === "" ? "Please choose gender" : null),
        },
    });

    const { classes } = useStyles();

    const searchUserQuery = useQuery({
        queryKey: ["searchUser_new_user"],
        refetchOnWindowFocus: false,
        enabled: false,
        queryFn: () => {
            return axios.get(
                `/api/users/v2/search-users?searchTerm=${form.values.name}`
            );
        },
        onSuccess: (res) => {
            console.log("users fetched", res.data);
        },
        onError: (err) => {
            console.log(err);
        },
    });

    const userInfoMutation = useMutation({
        mutationFn: (values) => {
            //console.log("body sent", form.values);
            return axios.put(
                `/api/users/v2/${session.user.id}?isNewUser=true`,
                values
            );
        },
        onSuccess: (res) => {
            notifySuccess("your profile information has been updated");
            //console.log("info update stage", res.data);
            searchUserQuery.refetch();
            setViewMode("unclaimedProfiles");
        },
        onError: () => {
            notifyError("could not update your profile information");
        },
    });

    const createClaimMutation = useMutation({
        mutationFn: ({ targetUnclaimedProfile, message }) => {
            const bod = {
                userId: session.user.id,
                targetId: targetUnclaimedProfile._id.toString(),
                targetOwnerId: targetUnclaimedProfile.owner
                    ? targetUnclaimedProfile.owner
                    : "none",
                name: targetUnclaimedProfile.name,
                claimerName: session?.user?.name,
                message: message,
                status: "pending",
            };
            //console.log("body sent", bod);
            //console.log("selected unclaimed", targetUnclaimedProfile);
            return axios.post("/api/claim-requests-api/v2", bod);
            //console.log("message", targetUnclaimedProfile, message);
            //return 1
        },
        onSuccess: (res) => {
            notifySuccess("your claim request has been sent");
            //console.log("claim request created", res.data);
            //setClaimButtonDisabled(true);
            //router.push("/family-tree/tree/my-trees");
            setViewMode("invitations");
        },
        onError: () => {
            notifyError("could not send your claim request");
            //notifyError();
        },
    });

    if (status === "loading") {
        return (
            <div className={classes.root}>
                <div className={classes.bgImage}></div>
                <div className={classes.cont}>loading...</div>
            </div>
        );
    }
    return (
        <div className={classes.root}>
            <div className={classes.bgImage}></div>
            <div
                style={{
                    position: "absolute",
                    overflow: "auto",
                    maxHeight: "100%",
                    width: "100%",
                }}
            >
                <Container
                    size="md"
                    //mt={60}
                    //w="100%"
                    p={0}
                    className={classes.cont}
                >
                    <TigrayWikiLogo disabled={true} extraLarge={true} />

                    {viewMode === "form" && (
                        <NewUserForm
                            form={form}
                            onSubmit={form.onSubmit((values) => {
                                userInfoMutation.mutate(values);
                                //searchUserQuery.refetch();
                                //setViewMode("unclaimedProfiles");
                            })}
                            loading={userInfoMutation.isLoading}
                        />
                    )}

                    {viewMode === "unclaimedProfiles" &&
                        (searchUserQuery.isLoading ? (
                            <Searching message="looking for unclaimed profiles..." />
                        ) : (
                            <UnclaimedProfilesList
                                profiles={searchUserQuery.data.data.data.filter(
                                    (u) => u.owner !== "self"
                                )}
                                onSendClaimRequest={(
                                    targetUnclaimedProfile,
                                    message
                                ) =>
                                    createClaimMutation.mutate({
                                        targetUnclaimedProfile,
                                        message,
                                    })
                                }
                                loading={createClaimMutation.isLoading}
                                onContinueWithoutClaim={() =>
                                    setViewMode("invitations")
                                }
                            />
                        ))}
                    {viewMode === "invitations" && <InvitationsListsV2 />}
                </Container>
            </div>
            <Modal
                opened={showIntroModal}
                onClose={() => setShowIntroModal(false)}
                size="auto"
                title="Help"
                withCloseButton={false}
                closeOnClickOutside={false}
            >
                <NewUserIntroductionModal
                    setShowIntroModal={setShowIntroModal}
                />
            </Modal>

            <Toaster />
        </div>
    );
}
