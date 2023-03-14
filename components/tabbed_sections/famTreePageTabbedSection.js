import { Container, Tabs } from "@mantine/core";
import { IconEye, IconUser, IconUserPlus } from "@tabler/icons";
import useFamTreePageStore from "../../lib/stores/famtreePageStore";
import { AddFamilyMemberSteps } from "../add_member_components/addFamilyMember";
import { UserInfoCard } from "../user_view_cards/userInfoCard";

export function FamtreePageTabbedSection() {
    const selectedTreeMember = useFamTreePageStore(
        (state) => state.selectedTreeMember
    );
    return (
        <Container mih="100vh">
            <Tabs
                keepMounted={false}
                defaultValue="viewMember"
                variant="outline"
            >
                <Tabs.List grow>
                    <Tabs.Tab
                        value="viewMember"
                        icon={<IconEye size={20} color="skyblue" />}
                    >
                        View Member
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="addMember"
                        icon={<IconUserPlus size={20} color="skyblue" />}
                    >
                        Add Member
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="viewMember">
                    <UserInfoCard user={selectedTreeMember} mode="view" />
                </Tabs.Panel>
                <Tabs.Panel value="addMember">
                    <div style={{ height: "100vh", overflow: "auto" }}>
                        <AddFamilyMemberSteps />
                    </div>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
