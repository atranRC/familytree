import { Divider, Stack, Text, Title } from "@mantine/core";
import { useStyles } from "./ProfileOverviewStyles";
import {
    IconAffiliate,
    IconArmchair2,
    IconArrowMergeBoth,
    IconBabyCarriage,
    IconBallon,
    IconBallpen,
    IconCalendarEvent,
    IconCoffin,
    IconGrowth,
    IconMicrophone2,
} from "@tabler/icons";
import TreeCard from "../../cards/tree_card/TreeCard";
import { useContext } from "react";
//import { ProfilePageProfileContext } from "../../../../pages/profiles/[id]/[view]";

import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import moment from "moment";
import CountUp from "react-countup";
import {
    ProfilePageProfileContext,
    ProfileRelationContext,
} from "../../../../contexts/profilePageContexts";
import MutualTreeCard from "../../cards/mutual_tree/MutualTreeCard";
import NoDataToShow from "../../empty_data_comps/NoDataToShow";

const MOCK_TREE = {
    _id: "65914d35686a6d28d749aaca",
    owner: "643995bce66ef5c3aa05c478",
    tree_name: "atrantwo tree 7",
    description: "atrantwo tree 7 desc",
    privacy: "private",
    createdAt: "12/12/12",
    updatedAt: "12/12/12",
};
export default function ProfileOverview() {
    const profileContext = useContext(ProfilePageProfileContext);
    const profileRelationContext = useContext(ProfileRelationContext);
    const { classes } = useStyles();
    const router = useRouter();

    const profileStatsQuery = useQuery({
        queryKey: ["get-profile-stats"],
        refetchOnWindowFocus: false,
        enabled: router.isReady,
        queryFn: () => {
            return axios.get(`/api/v2/get-profile-stats/${router.query["id"]}`);
        },
        onSuccess: (res) => {
            //console.log("profile user", res.data.name);
        },
    });

    if (profileStatsQuery.isLoading) return <div>loading</div>;

    return (
        <div className={classes.cont}>
            <div className={classes.statCont}>
                <div className={classes.infoStatSection}>
                    <div className={classes.stat}>
                        <IconBabyCarriage
                            size={32}
                            color={
                                profileContext.died
                                    ? "gray"
                                    : profileContext.owner !== "self"
                                    ? "green"
                                    : "#6f32be"
                            }
                            opacity={0.7}
                        />
                        <Text color="dimmed">Born</Text>
                        <Title
                            order={2}
                            weight={700}
                            sx={{ fontFamily: "Lora, serif" }}
                        >
                            {profileContext?.birthday ? (
                                moment(profileContext?.birthday).format(
                                    "YYYY-MM-DD"
                                )
                            ) : (
                                <>-</>
                            )}
                        </Title>
                    </div>
                    <div className={classes.stat}>
                        <IconBallon
                            size={32}
                            color={
                                profileContext.died
                                    ? "gray"
                                    : profileContext.owner !== "self"
                                    ? "green"
                                    : "#6f32be"
                            }
                            opacity={0.7}
                        />
                        <Text color="dimmed">Birthplace</Text>
                        <Title order={2} sx={{ fontFamily: "Lora, serif" }}>
                            {profileContext?.birth_place?.value}
                        </Title>
                    </div>
                    <div className={classes.stat}>
                        {profileContext.died ? (
                            <Stack align="center" spacing={2}>
                                <IconCoffin
                                    size={32}
                                    color={
                                        profileContext.died
                                            ? "gray"
                                            : profileContext.owner !== "self"
                                            ? "green"
                                            : "#6f32be"
                                    }
                                    opacity={0.7}
                                />
                                <Text color="dimmed">Date of Death</Text>
                                <Title
                                    order={2}
                                    weight={800}
                                    sx={{ fontFamily: "Lora, serif" }}
                                >
                                    {profileContext?.died ? (
                                        moment(profileContext?.died).format(
                                            "YYYY-MM-DD"
                                        )
                                    ) : (
                                        <>-</>
                                    )}
                                </Title>
                            </Stack>
                        ) : (
                            <Stack align="center" spacing={2}>
                                <IconArmchair2
                                    size={32}
                                    color={
                                        profileContext.died
                                            ? "gray"
                                            : profileContext.owner !== "self"
                                            ? "green"
                                            : "#6f32be"
                                    }
                                    opacity={0.7}
                                />
                                <Text color="dimmed">Current Residence</Text>
                                <Title
                                    order={2}
                                    weight={800}
                                    sx={{ fontFamily: "Lora, serif" }}
                                >
                                    {profileContext?.current_residence?.value}
                                </Title>
                            </Stack>
                        )}
                    </div>
                </div>
                <div className={classes.numberStatSection}>
                    <div className={classes.stat}>
                        <IconCalendarEvent
                            size={32}
                            color={
                                profileContext.died
                                    ? "gray"
                                    : profileContext.owner !== "self"
                                    ? "green"
                                    : "#6f32be"
                            }
                            opacity={0.7}
                        />
                        <Text color="dimmed">Events</Text>
                        <Title weight={800} sx={{ fontFamily: "Lora, serif" }}>
                            <CountUp
                                end={profileStatsQuery?.data?.data?.eventsCount}
                                duration={4}
                            />
                        </Title>
                    </div>
                    <div className={classes.stat}>
                        <IconBallpen
                            size={32}
                            color={
                                profileContext.died
                                    ? "gray"
                                    : profileContext.owner !== "self"
                                    ? "green"
                                    : "#6f32be"
                            }
                            opacity={0.7}
                        />
                        <Text color="dimmed">Written Stories</Text>
                        <Title weight={800} sx={{ fontFamily: "Lora, serif" }}>
                            <CountUp
                                end={
                                    profileStatsQuery?.data?.data
                                        ?.writtenStoriesCount
                                }
                                duration={4}
                            />
                        </Title>
                    </div>
                    <div className={classes.stat}>
                        <IconMicrophone2
                            size={32}
                            color={
                                profileContext.died
                                    ? "gray"
                                    : profileContext.owner !== "self"
                                    ? "green"
                                    : "#6f32be"
                            }
                            opacity={0.7}
                        />
                        <Text color="dimmed">Audio Stories</Text>
                        <Title weight={800} sx={{ fontFamily: "Lora, serif" }}>
                            <CountUp
                                end={
                                    profileStatsQuery?.data?.data
                                        ?.audioStoriesCount
                                }
                                duration={4}
                            />
                        </Title>
                    </div>
                    <div className={classes.stat}>
                        <IconGrowth
                            size={32}
                            color={
                                profileContext.died
                                    ? "gray"
                                    : profileContext.owner !== "self"
                                    ? "green"
                                    : "#6f32be"
                            }
                            opacity={0.7}
                        />
                        <Text color="dimmed">Family Trees</Text>
                        <Title weight={800} sx={{ fontFamily: "Lora, serif" }}>
                            <CountUp
                                end={profileStatsQuery?.data?.data?.treesCount}
                                duration={4}
                            />
                        </Title>
                    </div>
                </div>
            </div>

            {!profileRelationContext.isSelf && (
                <div className={classes.treesSection}>
                    <Stack align="center" spacing={3}>
                        <IconAffiliate
                            size={48}
                            color={
                                profileContext.died
                                    ? "gray"
                                    : profileContext.owner !== "self"
                                    ? "green"
                                    : "#6f32be"
                            }
                            opacity={0.7}
                        />
                        <Title
                            align="right"
                            sx={{
                                minWidth: "300px",
                                maxWidth: "300px",
                                fontFamily: "Lora, serif",
                                fontWeight: "200",
                            }}
                        >{`Trees you have in common with ${profileContext.name}`}</Title>
                    </Stack>
                    <Divider orientation="vertical" ml="md" mr="md" />
                    {profileRelationContext.mutualTrees.map((tree) => (
                        <MutualTreeCard tree={tree} key={tree._id} />
                    ))}
                    {profileRelationContext.mutualTrees.length === 0 && (
                        <NoDataToShow
                            message={`You have no trees in common with ${profileContext.name}`}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
