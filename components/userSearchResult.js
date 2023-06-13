import { Carousel } from "@mantine/carousel";
import {
    Avatar,
    createStyles,
    Group,
    Paper,
    Stack,
    Title,
    Text,
    ScrollArea,
    Divider,
    MediaQuery,
    SimpleGrid,
    Button,
    Image,
} from "@mantine/core";
import { ClickUserToView } from "./searchPageTabs";

export function SearchResultUserCard({ user, setModalOpened, setUserToView }) {
    const useStyles = createStyles((theme) => ({
        paper: {
            padding: "10px",
            cursor: "pointer",
            maxWidth: "100%",

            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
            "&:hover": {
                //border: "1px solid",
                backgroundColor: theme.colors.blue[1],
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                transition: "0.5s",
            },
        },
    }));

    const { classes } = useStyles();
    return (
        <Paper
            className={classes.paper}
            onClick={() => {
                setUserToView(user);
                setModalOpened(true);
            }}
        >
            <Group>
                <Avatar
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
                    radius="xl"
                    size="lg"
                />
                <Stack spacing={0} justify="flex-start">
                    <Title order={4} fw={500}>
                        {user.name}
                    </Title>
                    <Text size="sm" c="dimmed" fw={500} order={6}>
                        Born: {user.birthday && user.birthday.toString()}
                    </Text>
                    <Text size="sm" c="dimmed" fw={500} order={6}>
                        Location: {user.current_residence}
                    </Text>
                </Stack>
            </Group>
        </Paper>
    );
}

export function SearchPageSearchResults({
    users,
    setModalOpened,
    setUserToView,
    userToView,
}) {
    return (
        <Group style={{ minWidth: "100%", height: "100%" }} position="apart">
            <MediaQuery smallerThan="sm" styles={{ minWidth: "100%" }}>
                <Paper
                    withBorder
                    style={{
                        maxWidth: "40%",
                        padding: "5px",
                        height: "100%",
                    }}
                >
                    <Title p="xs" order={2} fw={550} color="dimmed">
                        Results:
                    </Title>
                    <Divider />
                    <ScrollArea style={{ height: "100vh" }} pt="sm">
                        <Stack>
                            {users.map((user) => {
                                return (
                                    <SearchResultUserCard
                                        setModalOpened={setModalOpened}
                                        user={user}
                                        setUserToView={setUserToView}
                                        key={user._id.toString()}
                                    />
                                );
                            })}
                        </Stack>
                    </ScrollArea>
                </Paper>
            </MediaQuery>

            <Divider orientation="vertical" />
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Paper
                    withBorder
                    style={{
                        minWidth: "54%",
                        maxWidth: "54%",
                        padding: "5px",
                        height: "100%",
                    }}
                >
                    <Title p="xs" order={2} fw={550} color="dimmed">
                        User Information
                    </Title>
                    <Divider />

                    <ClickUserToView type={"single"} userToView={userToView} />
                </Paper>
            </MediaQuery>
        </Group>
    );
}

export function ModalUserInfo({ user }) {
    const useStyles = createStyles((theme) => ({
        accountCard: {
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            "&:hover": {
                //border: "1px solid",
                backgroundColor: theme.colors.blue[2],
                boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
                transition: "0.5s",
            },
            borderRadius: "5px",
            cursor: "pointer",
            padding: "3px",
        },
        goToAccount: {
            marginTop: "20px",
        },
        stack: {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
        },
    }));
    const { classes } = useStyles();
    const accountAlbum = [
        "https://images.unsplash.com/photo-1672327114747-261be18f4907?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80",
        "https://images.unsplash.com/photo-1671826638399-54ac6a5447ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://images.unsplash.com/photo-1664575602807-e002fc20892c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://plus.unsplash.com/premium_photo-1668127296901-0e01aab056f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
        "https://images.unsplash.com/photo-1672259391793-84ea24f38810?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80",
    ];
    return (
        <Paper style={{ overflow: "auto", height: "90vh" }}>
            <Stack
                width="100%"
                spacing={0}
                align={"center"}
                className={classes.stack}
            >
                <Avatar
                    size="xl"
                    src="https://img.icons8.com/color/512/kenya-circular.png"
                />
                <Title order={2}>{user.username}</Title>
                <Title c="dimmed" fw={500} order={6} align="center" mb="sm">
                    Nairobi, Kenya
                </Title>
                <SimpleGrid
                    cols={3}
                    breakpoints={[
                        {
                            maxWidth: 980,
                            cols: 3,
                            spacing: "md",
                        },
                        {
                            maxWidth: 755,
                            cols: 2,
                            spacing: "sm",
                        },
                        {
                            maxWidth: 600,
                            cols: 1,
                            spacing: "sm",
                        },
                    ]}
                >
                    <div>
                        <Title order={5} color="dimmed" weight={500}>
                            Born
                        </Title>
                        <Text>
                            <Text fw={500}>1990</Text>
                        </Text>
                    </div>
                    <div>
                        <Title order={5} color="dimmed" weight={500}>
                            Siblings
                        </Title>
                        <Text>
                            <Text fw={500}>samuser2, samuser3, samuser4</Text>
                        </Text>
                    </div>
                    <div>
                        <Title order={5} color="dimmed" weight={500}>
                            Nicknames
                        </Title>
                        <Text>
                            <Text fw={500}>nickaname1, nickname2</Text>
                        </Text>
                    </div>
                </SimpleGrid>

                <Title mt={10} order={5} color="dimmed" weight={500}>
                    Photos
                </Title>
                <Carousel
                    withIndicators
                    height={200}
                    slideSize="33.333333%"
                    slideGap="md"
                    speed={20}
                    align="start"
                    loop
                    breakpoints={[
                        {
                            maxWidth: "md",
                            slideSize: "50%",
                        },
                        {
                            maxWidth: "sm",
                            slideSize: "100%",
                            slideGap: 0,
                        },
                    ]}
                >
                    {accountAlbum.map((accAl) => {
                        return (
                            <Carousel.Slide key={accAl}>
                                <Image src={accAl} alt="img five" />
                            </Carousel.Slide>
                        );
                    })}
                </Carousel>
                <Button fullWidth mt="xl" size="md" mb={10}>
                    Send Request
                </Button>
            </Stack>
        </Paper>
    );
}
