import { Box } from "@mantine/core";
import { UnclaimedProfilesHelp } from "./tutorials";

export default function HelpModalContent({ helpType }) {
    return (
        <Box sx={{ maxWidth: "40rem" }}>
            {helpType === "unclaimedProfiles" && <UnclaimedProfilesHelp />}
            {helpType === "events" && <div>events</div>}
        </Box>
    );
}
