import { Menu, Tabs, Text } from "@mantine/core";
import { IconArrowAutofitDown, IconCaretDown } from "@tabler/icons";
import { useRouter } from "next/router";

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
                    <Menu shadow="md" width={200}>
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
                    </Menu>
                )}
            </Tabs.List>
        </Tabs>
    );
}
