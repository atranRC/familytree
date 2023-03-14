import { Tabs } from "@mantine/core";
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
                if (value === "drafts") {
                    url = `/profiles/${id}/my-articles/${value}`;
                }
                router.push(url);
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
                {(sessionProfileRelation === "owner" ||
                    sessionProfileRelation === "self") && (
                    <Tabs.Tab value="claim-requests">Claim Requests</Tabs.Tab>
                )}
                {(sessionProfileRelation === "owner" ||
                    sessionProfileRelation === "self") && (
                    <Tabs.Tab value="privacy">Privacy Settings</Tabs.Tab>
                )}
                {sessionProfileRelation === "self" && (
                    <Tabs.Tab value="my-articles">My Articles</Tabs.Tab>
                )}
                {sessionProfileRelation === "self" && (
                    <Tabs.Tab value="drafts">Drafts</Tabs.Tab>
                )}
            </Tabs.List>
        </Tabs>
    );
}
