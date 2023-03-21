import {
    Avatar,
    Container,
    Paper,
    SimpleGrid,
    Stack,
    Title,
    Text,
    Button,
    Image,
    Group,
    createStyles,
    Divider,
    Loader,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons";
import { Carousel } from "@mantine/carousel";
import { useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";

export function SmallSearchResultUserCard({ user }) {
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
        <Paper className={classes.paper}>
            <Group>
                <Avatar src={user.image} radius="xl" size="lg" />
                <Stack spacing={0} justify="flex-start">
                    <Title order={4} fw={500}>
                        {user.name} {user.fathers_name} {user.last_name}
                    </Title>
                    <Text size="sm" c="dimmed" fw={500} order={6}>
                        Born:{" "}
                        {user.birthday &&
                            user.birthday.toString().split("T")[0]}
                    </Text>
                    <Text size="sm" c="dimmed" fw={500} order={6}>
                        Location: {user.current_residence}
                    </Text>
                </Stack>
            </Group>
        </Paper>
    );
}

export function UserInfoCard({
    user,
    mode,
    handleAddToTree,
    isLoading,
    isFetching,
    isError,
}) {
    const accountAlbum = [
        "https://images.unsplash.com/photo-1672327114747-261be18f4907?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=449&q=80",
        "https://images.unsplash.com/photo-1671826638399-54ac6a5447ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://images.unsplash.com/photo-1664575602807-e002fc20892c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
        "https://plus.unsplash.com/premium_photo-1668127296901-0e01aab056f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80",
        "https://images.unsplash.com/photo-1672259391793-84ea24f38810?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80",
    ];
    /* const { isLoading, isFetching, data, refetch, isError, error } = useQuery(
        "similar-users-with-info",
        () => {
            let uri =
                "/api/users/search-headless/" +
                newRelativeFirstName;
            return axios.get(uri);
        },
        { enabled: false }
    );
    const handleViewProfile = () => {
        //route to profile page
        return 0;
    };
    const handleAddRelative = () => {
        refetch();
    };*/

    return (
        <Container bg="#f7f9fc" py="md">
            <Stack spacing="sm">
                <Paper withBorder py="md">
                    <Stack align="center" justify="center" spacing={0}>
                        <Avatar size="xl" src={user.image} />
                        <Title fw={500} order={3}>
                            {user.name}
                        </Title>
                        <Text color="dimmed" weight={500}>
                            {user.current_residence}
                        </Text>
                    </Stack>
                </Paper>
                <Paper withBorder p="md">
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
                                <Text fw={500}>
                                    {user.birthday &&
                                        user.birthday.toString().split("T")[0]}
                                </Text>
                            </Text>
                        </div>
                        <div>
                            <Title order={5} color="dimmed" weight={500}>
                                Place of birth
                            </Title>
                            <Text>
                                <Text fw={500}>{user.birth_place}</Text>
                            </Text>
                        </div>
                        <div>
                            <Title order={5} color="dimmed" weight={500}>
                                Nicknames
                            </Title>
                            <Text>
                                <Text fw={500}>{user.nicknames}</Text>
                            </Text>
                        </div>
                    </SimpleGrid>
                </Paper>
                <Paper withBorder p="md">
                    <Stack justify="cneter" align="center">
                        <Title fw={500} order={3}>
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
                                        <Image src={accAl} />
                                    </Carousel.Slide>
                                );
                            })}
                        </Carousel>
                    </Stack>
                </Paper>
                {mode === "view" ? (
                    <Button
                        fullWidth
                        mt="xl"
                        size="md"
                        variant="gradient"
                        gradient={{ from: "teal", to: "blue", deg: 60 }}
                        rightIcon={<IconExternalLink size={15} />}
                    >
                        View Profile
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        mt="xl"
                        size="md"
                        variant="gradient"
                        gradient={{ from: "teal", to: "blue", deg: 60 }}
                        rightIcon={<IconExternalLink size={15} />}
                        loading={isLoading || isFetching}
                        onClick={handleAddToTree}
                    >
                        Add to Family Tree
                    </Button>
                )}
            </Stack>
        </Container>
    );
}

export function AddRelativeCreateProfileView({
    firstName,
    fathersName,
    nicknames,
    location,
    birthPlace,
    birthday,
    relationTo,
    selectedTreeMember,
    createHandler,
    isLoading,
    isFetching,
    isError,
}) {
    return (
        <Paper withBorder p="md">
            <Stack justify="center" align="left" spacing="xs">
                <Title fw={500} order={3} align="center" c="teal">
                    {firstName} {fathersName}
                </Title>
                <Divider />
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Born
                    </Title>
                    <Text>
                        <Text fw={500}>{birthday && birthday.toString()}</Text>
                    </Text>
                </div>
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Place of birth
                    </Title>
                    <Text>
                        <Text fw={500}>{birthPlace}</Text>
                    </Text>
                </div>
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Location
                    </Title>
                    <Text>
                        <Text fw={500}>{location}</Text>
                    </Text>
                </div>
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Nicknames
                    </Title>
                    <Text>
                        <Text fw={500}>{nicknames}</Text>
                    </Text>
                </div>
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Relation to {selectedTreeMember.name}
                    </Title>
                    <Text>
                        <Text fw={500}>{relationTo}</Text>
                    </Text>
                </div>
            </Stack>
            <Button
                fullWidth
                mt="xl"
                size="md"
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                rightIcon={<IconExternalLink size={15} />}
                loading={isLoading || isFetching}
                onClick={createHandler}
            >
                Create {firstName}s profile
            </Button>
        </Paper>
    );
}

export function AddCollabProfileView({
    firstName,
    fathersName,
    nicknames,
    location,
    birthPlace,
    birthday,
    addCollabHandler,
    isLoading,
    isFetching,
    isError,
}) {
    return (
        <Paper withBorder p="md">
            <Stack justify="center" align="left" spacing="xs">
                <Title fw={500} order={3} align="center" c="teal">
                    {firstName} {fathersName}
                </Title>
                <Divider />
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Born
                    </Title>
                    <Text>
                        <Text fw={500}>{birthday && birthday.toString()}</Text>
                    </Text>
                </div>
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Place of birth
                    </Title>
                    <Text>
                        <Text fw={500}>{birthPlace}</Text>
                    </Text>
                </div>
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Location
                    </Title>
                    <Text>
                        <Text fw={500}>{location}</Text>
                    </Text>
                </div>
                <div>
                    <Title order={5} color="dimmed" weight={500}>
                        Nicknames
                    </Title>
                    <Text>
                        <Text fw={500}>{nicknames}</Text>
                    </Text>
                </div>
            </Stack>
            <Button
                fullWidth
                mt="xl"
                size="md"
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                rightIcon={<IconExternalLink size={15} />}
                loading={isLoading || isFetching}
                onClick={addCollabHandler}
            >
                Add {firstName} as collaborator
            </Button>
        </Paper>
    );
}
