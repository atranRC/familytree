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
    Title,
    createStyles,
} from "@mantine/core";
import { NewsHorizontalScroll } from "../components/wiki/NewsHorizontalScroll";
import ArtefactBanner from "../components/wiki/ArtefactBanner";
import WikiNavBar from "../components/v2/nav/wiki_navbar/WikiNavbar";
import WelcomeGrid from "../components/v2/grids/welcome_grid/WelcomeGrid";
import FeaturedEventWikisGrid from "../components/v2/grids/featured_event_wikis/FeaturedEventWikiGrid";
import FeaturedStoriesFromPeopleGrid from "../components/v2/grids/stories_from_people/FeaturedStoriesFromPeopleGrid";
import FeaturedPeopleGrid from "../components/v2/grids/featured_people/FeaturedPeopleGrid";
import { FooterCentered } from "../components/appFooter/appFooter";
import { mockData } from "../components/appFooter/mockData";

const useStyles = createStyles((theme) => ({
    //#F7F7F7 -gray
}));

export default function HomeV2() {
    const { classes } = useStyles();
    return (
        <div>
            <WikiNavBar />
            <Container
                size="lg"
                mt={60}
                //w="100%"
                p={0}
            >
                <Stack spacing="xl">
                    <WelcomeGrid />
                    <Divider />
                    <Title
                        mt="xl"
                        pl={10}
                        order={2}
                        sx={{
                            //minWidth: "300px",
                            //maxWidth: "300px",
                            fontFamily: "Lora, serif",
                            fontWeight: "200",
                        }}
                    >
                        Featured Events From the Tigray Timeline
                    </Title>
                    <FeaturedEventWikisGrid type="gen" />
                    <Divider />
                    <FeaturedStoriesFromPeopleGrid />
                    <Divider />
                    <FeaturedPeopleGrid
                        header="Meet the Heroes of Tigray"
                        withFilters={true}
                    />
                </Stack>
            </Container>
            <FooterCentered links={mockData.links} />
        </div>
    );
}
