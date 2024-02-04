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
    Stack,
    createStyles,
} from "@mantine/core";
import { ResponsiveNav } from "./navBar";
import { FooterCentered } from "./appFooter/appFooter";
import { mockData } from "./appFooter/mockData";
import { ProfileNavBar } from "./v2/nav/profile_navbar/ProfileNavBar";

const useStyles = createStyles((theme) => ({
    containerFooterCont: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
    },
    container: {
        minHeight: "100vh",
        "@media (max-width: 800px)": {
            //flexWrap: "wrap",
            paddingLeft: "0px",
            paddingRight: "0px",
        },
    },
}));

export default function AppShellContainer({ children, activePage = "" }) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const { classes } = useStyles();
    return (
        <AppShell
            styles={{
                main: {
                    /*background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],*/
                    background: "#FCFCFC",
                    padding: "0px",
                    minHeight: "100vh",
                },
            }}
            footer={<FooterCentered links={mockData.links} />}
            header={<ProfileNavBar activeLink={activePage} />}
        >
            {/*<MediaQuery
                smallerThan="sm"
                styles={{ paddingLeft: "0px", paddingRight: "0px" }}
            >*/}

            <Container size="lg" mb="md" mt="sm" className={classes.container}>
                {children}
            </Container>
            {/*</MediaQuery>*/}

            {/*<div style={{ marginTop: "60px", width: "100%" }}>{children}</div>*/}
        </AppShell>
    );
}
