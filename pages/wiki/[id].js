import { Container, Stack } from "@mantine/core";
import WikiNavBar from "../../components/v2/nav/wiki_navbar/WikiNavbar";
import WikiViewer from "../../components/v2/viewers/wiki_article/WikiViewer";
import { FooterCentered } from "../../components/appFooter/appFooter";
import { mockData } from "../../components/appFooter/mockData";

export default function WikiViewerPage() {
    return (
        <div>
            <WikiNavBar />

            <Container
                size="md"
                mt={60}
                mb={60}
                //w="100%"
                //mih="200vh"
                p={0}
                sx={{
                    "@media (max-width: 800px)": {
                        //fontSize: "1.5rem",
                        //marginBottom: "-1rem",
                        //display: "none",
                        //maxWidth: "100%",
                        padding: "10px",
                    },
                }}
            >
                <Stack spacing="xl">
                    <WikiViewer />
                </Stack>
            </Container>
            <FooterCentered links={mockData.links} />
        </div>
    );
}
