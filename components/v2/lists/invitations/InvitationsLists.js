import { Stack } from "@mantine/core";
import InvitationCard from "../../cards/invitation_card/InvitationCard";
import { useStyles } from "./InvitationsListsStyles";
import { useQuery } from "react-query";
import axios from "axios";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";
import toast, { Toaster } from "react-hot-toast";

export default function InvitationsLists({ email, type }) {
    const { classes } = useStyles();
    //
    const notifyAcceptedSuccess = () =>
        toast.success("you have accepted your invitation");
    const notifyAcceptedError = () => toast.error("something went wrong");

    const docsQuery = useQuery({
        queryKey: ["invitations-list", type],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            return axios.get(
                `/api/invitations/my-invitations?email=${email}&type=${type}&status=pending`
            );
        },
        onSuccess: (result) => {},
    });

    if (docsQuery.isLoading) return <div>⏳</div>;
    if (docsQuery?.data?.data.length == 0)
        return (
            <div>
                <NoDataToShow message="No invitations available" /> <Toaster />
            </div>
        );
    return (
        <div className={classes.cont}>
            <Stack spacing={3}>
                {docsQuery?.data?.data.map((invitation) => (
                    <InvitationCard
                        key={invitation._id}
                        invitation={invitation}
                        onSuccess={notifyAcceptedSuccess}
                        onErr={notifyAcceptedError}
                    />
                ))}
            </Stack>
            <Toaster />
        </div>
    );
}
