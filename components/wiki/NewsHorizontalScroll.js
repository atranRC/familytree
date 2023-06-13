import {
    createStyles,
    SimpleGrid,
    Card,
    Image,
    Text,
    Container,
    AspectRatio,
    ScrollArea,
    Group,
    Stack,
    Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons";

const mockdata = [
    {
        title: "In depth: Pretoria Peace Deal",
        image: "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/K7AVWD4WBJIONF6KLCMBY3IB7E.jpg",
        date: "May 18, 2023",
    },
    {
        title: "Access to clean water in Tigray",
        image: "https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/19-01-2022_UNICEF_Ethiopia+1.jpg/image1170x530cropped.jpg",
        date: "August 27, 2022",
    },
    {
        title: "Back To School Under Poor Conditions",
        image: "https://addisstandard.com/wp-content/uploads/2023/05/Tigray-School-opening-.jpg",
        date: "April 9, 2023",
    },
    {
        title: "Battles of June: Liberation of Mekelle",
        image: "https://media-cldnry.s-nbcnews.com/image/upload/rockcms/2022-11/221102-Tigray-Peoples-Liberation-Front-al-1321-294b8c.jpg",
        date: "August 12, 2022",
    },
];

const useStyles = createStyles((theme) => ({
    card: {
        transition: "transform 150ms ease, box-shadow 150ms ease",
        boxShadow: theme.shadows.sm,
        "&:hover": {
            transform: "scale(1.01)",
            boxShadow: theme.shadows.xl,
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 600,
    },
}));

export function NewsHorizontalScroll() {
    const { classes } = useStyles();

    const cards = mockdata.map((article) => (
        <Card
            key={article.title}
            p="md"
            radius="md"
            component="a"
            href="#"
            className={classes.card}
            m="xs"
        >
            <AspectRatio ratio={1920 / 1080}>
                <Image src={article.image} alt="img nine" />
            </AspectRatio>
            <Text
                color="dimmed"
                size="xs"
                transform="uppercase"
                weight={700}
                mt="md"
            >
                {article.date}
            </Text>
            <Text className={classes.title} mt={5}>
                {article.title}
            </Text>
        </Card>
    ));

    return (
        <ScrollArea type="always" offsetScrollbars>
            <div
                style={{
                    display: "flex",
                    width: "max-content",
                    overflow: "hidden",
                }}
            >
                {cards}
                {
                    <Card
                        p="md"
                        radius="md"
                        component="a"
                        href="#"
                        className={classes.card}
                        m="xs"
                    >
                        <Stack justify="center" h="100%">
                            <IconPlus size={50} color="darkcyan" />
                            <Title order={4} underline color="blue.5">
                                More
                            </Title>
                        </Stack>
                    </Card>
                }
            </div>
        </ScrollArea>
    );
}
