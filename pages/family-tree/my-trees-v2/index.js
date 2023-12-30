import { useSession } from "next-auth/react";
import ProfileLoadingScreen from "../../../components/v2/loading_screens/profile_loading/ProfileLoadingScreen";
import AppShellContainer from "../../../components/appShell";
import { useRouter } from "next/router";
import { TreePageTitleSection } from "../../../components/titleSections";
import { MediaQuery, Title } from "@mantine/core";
import MyTreesGrid from "../../../components/v2/grids/my_trees/MyTreesGrid";

export default function MyTreesPageV2() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "unauthenticated")
        router.push("/u/signin?callBackUrl=%2Ffamily-tree%2Fmy-trees-v2");
    if (status === "loading") return <ProfileLoadingScreen />;

    return (
        <AppShellContainer>
            <TreePageTitleSection picUrl="https://img.freepik.com/free-vector/hand-drawn-tree-life-brown-shades_23-2148703761.jpg">
                <Title order={2} fw={600}>
                    Your Family Trees
                </Title>
                <Title order={5} fw={400} color="dimmed">
                    Family Trees you&apos;ve created
                </Title>
            </TreePageTitleSection>
            <MyTreesGrid />
        </AppShellContainer>
    );
}
