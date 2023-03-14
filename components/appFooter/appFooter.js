import {
    createStyles,
    Anchor,
    Group,
    ActionIcon,
    Stack,
    Divider,
    Title,
} from "@mantine/core";
import {
    IconBrandTwitter,
    IconBrandYoutube,
    IconBrandInstagram,
    IconAppWindow,
} from "@tabler/icons";

const useStyles = createStyles((theme) => ({
    footer: {
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[2]
        }`,
    },

    inner: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

        [theme.fn.smallerThan("sm")]: {
            flexDirection: "column",
        },
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm,
        },
    },
}));

export function FooterCentered({ links }) {
    const { classes } = useStyles();
    const items = links.map((link) => (
        <Anchor
            color="dimmed"
            key={link.label}
            href={link.link}
            sx={{ lineHeight: 1 }}
            onClick={(event) => event.preventDefault()}
            size="sm"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <div className={classes.inner}>
                <IconAppWindow size={28} />
                <Stack align="center" spacing={6}>
                    <Group className={classes.links}>{items}</Group>
                    <Title order={6} fw={500} c="dimmed">
                        made with ❤️💛
                    </Title>
                </Stack>

                <Group spacing="xs" position="right" noWrap>
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <IconBrandTwitter size={18} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <IconBrandYoutube size={18} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl">
                        <IconBrandInstagram size={18} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </div>
        </div>
    );
}
