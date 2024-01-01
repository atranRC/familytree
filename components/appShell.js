import { useState } from "react";
import { useRouter } from "next/router";
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
    Container,
    Title,
} from "@mantine/core";
import { ResponsiveNav } from "./navBar";
import { FooterCentered } from "./appFooter/appFooter";
import { mockData } from "./appFooter/mockData";
import { ProfileNavBar } from "./v2/nav/profile_navbar/ProfileNavBar";

export default function AppShellContainer({ children, activePage = "" }) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <AppShell
            styles={{
                main: {
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                    padding: "0px",
                },
            }}
            footer={<FooterCentered links={mockData.links} />}
            header={<ProfileNavBar activeLink={activePage} />}
        >
            <MediaQuery
                smallerThan="sm"
                styles={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
                <Container
                    size="lg"
                    mb="md"
                    mt="sm"
                    style={{ minHeight: "100vh" }}
                >
                    {children}
                </Container>
            </MediaQuery>
            {/*<div style={{ marginTop: "60px", width: "100%" }}>{children}</div>*/}
        </AppShell>
    );
}
