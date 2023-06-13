import Link from "next/link";
//import { useState } from 'react';
import { Shell } from "../components/wiki/Shell";
import FeaturedCards from "../components/wiki/FeaturedCards";
import {
    Box,
    Container,
    Divider,
    Group,
    MediaQuery,
    Paper,
    Stack,
    Text,
} from "@mantine/core";
import { NewsHorizontalScroll } from "../components/wiki/NewsHorizontalScroll";
import ArtefactBanner from "../components/wiki/ArtefactBanner";

export default function Home() {
    return (
        <Shell>
            <MediaQuery smallerThan="md" styles={{ padding: "0px" }}>
                <Container size="lg" mih="100vh">
                    <Stack>
                        <Paper
                            w="100%"
                            p="md"
                            mb="sm"
                            style={{
                                backgroundImage:
                                    "url(https://img.freepik.com/free-vector/full-color-pattern-with-ethnic-ornaments_1110-455.jpg?w=740&t=st=1683551599~exp=1683552199~hmac=5e2c500be64f3dce1f5308910aacd91cf2e86c171fb9e828f5e2535545a88953)",
                            }}
                        >
                            <Stack
                                spacing={0}
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, .4)",
                                }}
                                p="md"
                                m="sm"
                            >
                                <Group position="center">
                                    <h1 style={{ color: "#F5F5F5" }}>
                                        Welcome to{" "}
                                        <span
                                            style={{
                                                color: "white",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            TigrayWiki
                                        </span>
                                    </h1>
                                </Group>

                                <Group position="center">
                                    <Text c="white" fs="italic" fz="lg">
                                        - the encyclopedia for everything Tigray
                                        -
                                    </Text>
                                </Group>
                            </Stack>
                        </Paper>
                        <Paper
                            w="100%"
                            withBorder
                            mih="50vh"
                            bg="#f9fcfe"
                            p="md"
                            mb="md"
                        >
                            <Divider
                                label={<h1>Featured Today</h1>}
                                px="xl"
                                //py="xl"
                                pb="md"
                                labelPosition="center"
                                c="cyan"
                            />
                            <FeaturedCards />
                        </Paper>
                        <Paper w="100%" withBorder p="md" bg="#f9fcfe">
                            <Divider
                                label={<h1>Artefacts</h1>}
                                px="xl"
                                //pt="xl"
                                pb="md"
                                labelPosition="center"
                                c="cyan"
                            />
                            <ArtefactBanner />
                        </Paper>

                        {/*<Paper w="100%" withBorder p="md" bg="#f9fcfe">
                            <Divider
                                label={<h1>Current Events</h1>}
                                px="xl"
                                //pt="xl"
                                labelPosition="center"
                                c="cyan"
                            />
                            <NewsHorizontalScroll />
                        </Paper>*/}
                    </Stack>
                </Container>
            </MediaQuery>
        </Shell>
    );
}
