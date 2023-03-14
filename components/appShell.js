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

export default function AppShellContainer({ children }) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const path = useRouter().asPath;
    console.log("hello", path);
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
            header={<ResponsiveNav activeLink={path} />}
        >
            <MediaQuery
                smallerThan="sm"
                styles={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
                <Container
                    size="lg"
                    mt="60px"
                    mb="md"
                    style={{ minHeight: "100vh" }}
                >
                    {children}
                </Container>
            </MediaQuery>
            {/*<div style={{ marginTop: "60px", width: "100%" }}>{children}</div>*/}
        </AppShell>
    );
}
