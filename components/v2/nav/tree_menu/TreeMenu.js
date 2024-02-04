import {
    Accordion,
    ActionIcon,
    Badge,
    Box,
    Button,
    Divider,
    Group,
    Menu,
    NavLink,
    Spoiler,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
    IconBook,
    IconCalendarEvent,
    IconChevronLeft,
    IconGrowth,
    IconMap2,
    IconMenu2,
    IconMicrophone,
    IconPencil,
    IconSelector,
    IconTimelineEvent,
    IconTrash,
    IconUsers,
    IconX,
} from "@tabler/icons";
import { useState } from "react";

export default function TreeMenu({
    tree,
    activeTab = "",
    onViewModeSelect = () => {},
    onManageTreeSelect = () => {},
    sessionTreeRelation = "none",
}) {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const [showMenu, setShowMenu] = useState(true);
    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                justifyContent: "flex-start",
                gap: "1em",
            }}
        >
            <Stack spacing={3}>
                <Stack align="flex-end">
                    <ActionIcon onClick={() => setShowMenu(!showMenu)}>
                        {showMenu && <IconX />}
                        {!showMenu && <IconMenu2 color="black" />}
                    </ActionIcon>
                </Stack>
                {showMenu && (
                    <Stack spacing={3}>
                        <Badge
                            sx={{ alignSelf: "flex-start" }}
                            color={
                                tree?.privacy === "private" ? "blue" : "green"
                            }
                        >
                            {tree?.privacy}
                        </Badge>

                        <Title
                            sx={{
                                fontFamily: "Lora, serif",
                                fontSize: isMobile ? "14px" : "24",
                            }}
                            w="250px"
                        >
                            {tree?.tree_name}
                        </Title>
                        <Spoiler
                            maxHeight={50}
                            showLabel="Show more"
                            hideLabel="Hide"
                            w="200px"
                        >
                            <Text c="dimmed" size="sm">
                                {tree?.description}
                            </Text>
                        </Spoiler>
                        <Divider pb="sm" />

                        <Accordion
                            variant="contained"
                            radius="sm"
                            chevronPosition="left"
                            sx={{ background: "white" }}
                        >
                            <Accordion.Item value="customization">
                                <Accordion.Control
                                    sx={{
                                        background: "white",
                                        borderRadius: "10px",
                                    }}
                                >
                                    Menu
                                </Accordion.Control>
                                <Accordion.Panel
                                    sx={{
                                        background: "white",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <NavLink
                                        label={tree?.tree_name || "Tree"}
                                        icon={
                                            <IconGrowth
                                                size={18}
                                                color="gray"
                                            />
                                        }
                                        onClick={() => onViewModeSelect("tree")}
                                        sx={{
                                            borderLeft:
                                                activeTab === "tree" &&
                                                "3px solid teal",
                                            backgroundColor:
                                                activeTab === "tree" &&
                                                "#F8F9FA",
                                        }}
                                    />
                                    <NavLink
                                        label="Timelines"
                                        childrenOffset={28}
                                        icon={
                                            <IconTimelineEvent
                                                size={18}
                                                color="gray"
                                            />
                                        }
                                    >
                                        <NavLink
                                            label="Events Timeline"
                                            icon={
                                                <IconCalendarEvent
                                                    size={18}
                                                    color="darkgreen"
                                                />
                                            }
                                            onClick={() =>
                                                onViewModeSelect(
                                                    "events_timeline"
                                                )
                                            }
                                            sx={{
                                                borderLeft:
                                                    activeTab ===
                                                        "events_timeline" &&
                                                    "3px solid teal",
                                                backgroundColor:
                                                    activeTab ===
                                                        "events_timeline" &&
                                                    "#F8F9FA",
                                            }}
                                        />

                                        <NavLink
                                            label="Written Stories Timeline"
                                            icon={
                                                <IconPencil
                                                    size={18}
                                                    color="blue"
                                                />
                                            }
                                            onClick={() =>
                                                onViewModeSelect(
                                                    "written_stories_timeline"
                                                )
                                            }
                                            sx={{
                                                borderLeft:
                                                    activeTab ===
                                                        "written_stories_timeline" &&
                                                    "3px solid teal",
                                                backgroundColor:
                                                    activeTab ===
                                                        "written_stories_timeline" &&
                                                    "#F8F9FA",
                                            }}
                                        />

                                        <NavLink
                                            label="Audio Stories Timeline"
                                            icon={
                                                <IconMicrophone
                                                    size={18}
                                                    color="brown"
                                                />
                                            }
                                            onClick={() =>
                                                onViewModeSelect(
                                                    "audio_stories_timeline"
                                                )
                                            }
                                            sx={{
                                                borderLeft:
                                                    activeTab ===
                                                        "audio_stories_timeline" &&
                                                    "3px solid teal",
                                                backgroundColor:
                                                    activeTab ===
                                                        "audio_stories_timeline" &&
                                                    "#F8F9FA",
                                            }}
                                        />
                                    </NavLink>
                                    <NavLink
                                        label="Maps"
                                        childrenOffset={28}
                                        icon={
                                            <IconMap2 size={18} color="gray" />
                                        }
                                    >
                                        <NavLink
                                            label="Events Map"
                                            icon={
                                                <IconCalendarEvent
                                                    size={18}
                                                    color="darkgreen"
                                                />
                                            }
                                            onClick={() =>
                                                onViewModeSelect("events_map")
                                            }
                                            sx={{
                                                borderLeft:
                                                    activeTab ===
                                                        "events_map" &&
                                                    "3px solid teal",
                                                backgroundColor:
                                                    activeTab ===
                                                        "events_map" &&
                                                    "#F8F9FA",
                                            }}
                                        />

                                        <NavLink
                                            label="Stories Map"
                                            icon={
                                                <IconBook
                                                    size={18}
                                                    color="blue"
                                                />
                                            }
                                            onClick={() =>
                                                onViewModeSelect("stories_map")
                                            }
                                            sx={{
                                                borderLeft:
                                                    activeTab ===
                                                        "stories_map" &&
                                                    "3px solid teal",
                                                backgroundColor:
                                                    activeTab ===
                                                        "stories_map" &&
                                                    "#F8F9FA",
                                            }}
                                        />
                                    </NavLink>

                                    <NavLink
                                        label="Manage Tree"
                                        childrenOffset={28}
                                    >
                                        <NavLink
                                            label="Edit Tree"
                                            icon={
                                                <IconPencil
                                                    size={18}
                                                    color="green"
                                                />
                                            }
                                            onClick={() =>
                                                onManageTreeSelect("edit")
                                            }
                                            disabled={
                                                sessionTreeRelation !== "owner"
                                            }
                                        />
                                        <NavLink
                                            label="Collaborators"
                                            icon={
                                                <IconUsers
                                                    size={18}
                                                    color="teal"
                                                />
                                            }
                                            onClick={() =>
                                                onManageTreeSelect("collabs")
                                            }
                                            disabled={
                                                sessionTreeRelation !==
                                                    "owner" &&
                                                sessionTreeRelation !== "collab"
                                            }
                                        />
                                        <NavLink
                                            label="Delete Tree"
                                            icon={
                                                <IconTrash
                                                    size={18}
                                                    color="red"
                                                />
                                            }
                                            c="red"
                                            onClick={() =>
                                                onManageTreeSelect("delete")
                                            }
                                            disabled={
                                                sessionTreeRelation !== "owner"
                                            }
                                        />
                                    </NavLink>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
