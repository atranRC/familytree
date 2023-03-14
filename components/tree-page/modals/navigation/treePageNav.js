import { Tabs } from "@mantine/core";
import { useRouter } from "next/router";

export default function TreesNav({ activePage }) {
    const router = useRouter();
    return (
        <Tabs
            value={activePage}
            onTabChange={(value) => router.push(`/family-tree/tree/${value}`)}
        >
            <Tabs.List position="center">
                <Tabs.Tab value="my-trees">My Trees</Tabs.Tab>
                <Tabs.Tab value="my-collabs">My Collaborations</Tabs.Tab>
                <Tabs.Tab value="trees-im-in">Trees I'm In</Tabs.Tab>
                <Tabs.Tab value="unclaimed">Unclaimed Profiles</Tabs.Tab>
            </Tabs.List>
        </Tabs>
    );
}
