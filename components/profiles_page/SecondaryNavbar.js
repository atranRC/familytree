import { Box, Menu, NavLink, Popover, Tabs, Text } from "@mantine/core";
import {
    IconArrowAutofitDown,
    IconCaretDown,
    IconFingerprint,
    IconGauge,
    IconJpg,
    IconNotebook,
    IconTimelineEvent,
    IconVectorBezier,
} from "@tabler/icons";
import { useRouter } from "next/router";

{
    /*<Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Tabs.Tab value="#" icon={<IconCaretDown />}>
                                Articles
                            </Tabs.Tab>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Tabs.Tab value="my-articles">
                                    Published
                                </Tabs.Tab>
                            </Menu.Item>
                            <Menu.Item>
                                <Tabs.Tab value="drafts">Drafts</Tabs.Tab>
                            </Menu.Item>
                            <Menu.Item>
                                <Tabs.Tab value="media">Media</Tabs.Tab>
                            </Menu.Item>
                        </Menu.Dropdown>
                </Menu>*/
}

export default function SecondaryNavbar({
    activePage,
    id,
    sessionProfileRelation = "",
}) {
    const router = useRouter();
    return (
        <Tabs
            value={activePage}
            onTabChange={(value) => {
                let url = `/profiles/${id}/${value}`;
                if (value === "drafts" || value === "media") {
                    url = `/profiles/${id}/my-articles/${value}`;
                }

                value !== "#" && router.push(url);
            }}
        >
            <Tabs.List
                position="center"
                bg="white"
                p="md"
                style={{ border: "1px lightgray solid", borderRadius: "5px" }}
            >
                <Tabs.Tab value="events">Events</Tabs.Tab>
                <Tabs.Tab value="written-stories">Written Stories</Tabs.Tab>
                <Tabs.Tab value="audio-stories">Audio Stories</Tabs.Tab>
                <Tabs.Tab value="places">Places</Tabs.Tab>
                {(sessionProfileRelation === "owner" ||
                    sessionProfileRelation === "self") && (
                    <Tabs.Tab value="claim-requests">Claim Requests</Tabs.Tab>
                )}
                {(sessionProfileRelation === "owner" ||
                    sessionProfileRelation === "self") && (
                    <Tabs.Tab value="privacy">Privacy Settings</Tabs.Tab>
                )}
                {sessionProfileRelation === "self" && (
                    <Popover
                        width={200}
                        position="bottom"
                        withArrow
                        shadow="md"
                    >
                        <Popover.Target>
                            <Tabs.Tab value="#" icon={<IconCaretDown />}>
                                Articles
                            </Tabs.Tab>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Box w={180}>
                                <NavLink
                                    label="Timeline Articles"
                                    icon={<IconTimelineEvent size={18} />}
                                    childrenOffset={28}
                                >
                                    <NavLink
                                        label="Published"
                                        onClick={() =>
                                            router.push(
                                                `/profiles/${id}/my-articles/`
                                            )
                                        }
                                    />
                                    <NavLink
                                        label="Drafts"
                                        onClick={() =>
                                            router.push(
                                                `/profiles/${id}/my-articles/drafts`
                                            )
                                        }
                                    />
                                </NavLink>

                                <NavLink
                                    label="Wiki Pages"
                                    icon={<IconNotebook size={18} />}
                                    childrenOffset={28}
                                >
                                    <NavLink
                                        label="Published"
                                        onClick={() =>
                                            router.push(
                                                `/profiles/${id}/my-wikis/`
                                            )
                                        }
                                    />
                                    <NavLink
                                        label="Drafts"
                                        onClick={() =>
                                            router.push(
                                                `/profiles/${id}/my-wikis/drafts`
                                            )
                                        }
                                    />
                                </NavLink>
                                <NavLink
                                    label="Media"
                                    icon={<IconJpg size={18} />}
                                    onClick={() =>
                                        router.push(
                                            `/profiles/${id}/my-articles/media`
                                        )
                                    }
                                />
                            </Box>
                        </Popover.Dropdown>
                    </Popover>
                )}
            </Tabs.List>
        </Tabs>
    );
}
