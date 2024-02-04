import {
    Accordion,
    ActionIcon,
    Avatar,
    Button,
    Divider,
    Group,
    Image,
    Loader,
    Modal,
    Pagination,
    Paper,
    Radio,
    Stack,
    Text,
    TextInput,
    Title,
    createStyles,
} from "@mantine/core";
import { useState } from "react";
import { useStyles } from "./UnclaimedProfilesListStyles";
import { truncateWord } from "../../../../utils/utils";
import moment from "moment";
import Link from "next/link";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";
import HelpModalContent from "../../help/HelpModalContent";
import NewUserIntroductionModal from "../../help/NewUserIntroductionModal";
import { IconChevronsLeft, IconSend } from "@tabler/icons";
import { useMutation } from "react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function UnclaimedProfilesList({
    profiles,
    onSendClaimRequest,
    onContinueWithoutClaim,
    loading,
}) {
    const { classes } = useStyles();
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showClaimRequestComp, setShowClaimRequestComp] = useState(false);
    const [helpType, setHelpType] = useState();
    const [message, setMessage] = useState("");
    const [messageError, setMessageError] = useState(false);

    const createClaimRequestHandler = (selectedUnclaimed) => {
        if (message === "") {
            setMessageError(true);
        } else {
            //console.log("selected unclaimed", selectedUnclaimed);
            //userInfoMutation.mutate(selectedUnclaimed);
            onSendClaimRequest(selectedUnclaimed, message);
        }
    };

    return (
        <div className={classes.accordionContentCont}>
            <Title weight={900} color="#3c414a">
                Unclaimed Profiles
            </Title>
            <Title c="dimmed" fw={500} order={6} align="center" mb="sm">
                Any Unclaimed Profiles created in your name will show up below.
                Select the one that you think is you and send a Claim Request.
                We will automatically link the contents to your account on
                approval.{" "}
                <Text
                    span
                    color="blue"
                    underline
                    sx={{
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => {
                        setHelpType("unclaimedProfiles");
                        setShowHelpModal(true);
                    }}
                >
                    Read more
                </Text>{" "}
                about Unclaimed Profiles
            </Title>
            {profiles.length === 0 && (
                <NoDataToShow message="No Unclaimed Profiles Found">
                    <Button
                        fullWidth
                        variant="gradient"
                        gradient={{ from: "indigo", to: "cyan" }}
                        radius="1.5em"
                        onClick={() => onContinueWithoutClaim()}
                    >
                        Click here to continue
                    </Button>
                </NoDataToShow>
            )}
            <Accordion defaultValue="customization" w="100%">
                {profiles.map((user) => {
                    if (user.owner === "self") return;
                    return (
                        <Accordion.Item
                            value={user._id.toString()}
                            key={user._id}
                        >
                            <Accordion.Control sx={{ width: "100%" }}>
                                <Group noWrap>
                                    <Avatar
                                        radius="xl"
                                        size="md"
                                        src={user?.image}
                                    />
                                    <Stack spacing={0}>
                                        <Text>
                                            {truncateWord(
                                                `${user?.name} ${user?.fathers_name} ${user?.last_name} `,
                                                50
                                            )}
                                        </Text>
                                        <Text italic c="dimmed">
                                            {truncateWord(
                                                user?.current_residence?.value,
                                                50
                                            )}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack spacing={3} align="center">
                                    <div className={classes.infoCont}>
                                        <Stack spacing={0}>
                                            <Title
                                                order={2}
                                                className={classes.title}
                                            >
                                                {user.birthday ? (
                                                    moment(
                                                        user?.birthday
                                                    ).format("YYYY-MM-DD")
                                                ) : (
                                                    <>-</>
                                                )}
                                            </Title>
                                            <Text className={classes.text}>
                                                Born
                                            </Text>
                                        </Stack>
                                        <Stack spacing={0}>
                                            <Title
                                                order={2}
                                                className={classes.title}
                                            >
                                                {user?.birth_place?.value}
                                            </Title>
                                            <Text className={classes.text}>
                                                Birthplace
                                            </Text>
                                        </Stack>
                                        {user?.current_residence?.value && (
                                            <Stack spacing={0}>
                                                <Title
                                                    order={2}
                                                    className={classes.title}
                                                >
                                                    {
                                                        user?.current_residence
                                                            ?.value
                                                    }
                                                </Title>
                                                <Text className={classes.text}>
                                                    Current Residence
                                                </Text>
                                            </Stack>
                                        )}
                                        {/*<Link
                                        href={`/profiles/${user._id.toString()}/events`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                        className={classes.link}
                                    >
                                        Visit User&apos;s profile
                                    </Link>*/}
                                    </div>
                                    {showClaimRequestComp && (
                                        <Stack>
                                            <TextInput
                                                radius="xl"
                                                label="Message"
                                                placeholder="your short message"
                                                description="Send a message to the current owner of this unclaimed account"
                                                inputWrapperOrder={[
                                                    "label",
                                                    "description",
                                                    "error",
                                                    "input",
                                                ]}
                                                value={message}
                                                onChange={(e) =>
                                                    setMessage(e.target.value)
                                                }
                                                error={
                                                    messageError &&
                                                    "please enter message"
                                                }
                                                onFocus={() =>
                                                    setMessageError(false)
                                                }
                                            />
                                            <Group>
                                                <Button
                                                    radius="xl"
                                                    leftIcon={<IconSend />}
                                                    onClick={() =>
                                                        onSendClaimRequest(
                                                            user,
                                                            message
                                                        )
                                                    }
                                                    loading={loading}
                                                >
                                                    Send Claim Request
                                                </Button>
                                                <Button
                                                    radius="xl"
                                                    color="gray"
                                                    leftIcon={
                                                        <IconChevronsLeft />
                                                    }
                                                    onClick={() =>
                                                        setShowClaimRequestComp(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </Group>
                                        </Stack>
                                    )}
                                    {!showClaimRequestComp && (
                                        <Button
                                            radius="xl"
                                            color="cyan"
                                            fullWidth
                                            onClick={() =>
                                                setShowClaimRequestComp(true)
                                            }
                                        >{`Claim this profile`}</Button>
                                    )}
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
            {profiles.length > 0 && (
                <>
                    <Text>Don&apos;t think any of those is you? </Text>
                    <Text
                        underline
                        italic
                        c="blue"
                        sx={{ cursor: "pointer" }}
                        onClick={onContinueWithoutClaim}
                    >
                        Skip this step
                    </Text>
                </>
            )}

            <Modal
                opened={showHelpModal}
                onClose={() => setShowHelpModal(false)}
                size="auto"
                title="Help"
            >
                <HelpModalContent helpType="unclaimedProfiles" />
            </Modal>
        </div>
    );
}
