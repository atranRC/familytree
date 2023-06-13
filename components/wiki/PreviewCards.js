import {
    Group,
    Paper,
    Stack,
    Text,
    createStyles,
    Image,
    Divider,
    Skeleton,
    Badge,
} from "@mantine/core";
import Link from "next/link";

export function SkeletonCardWikiList() {
    return (
        <div style={{ width: "100%" }}>
            <Skeleton height={90} mb="xl" width="20%" radius="md" />
            <Skeleton height={8} width="5%" mb="xs" radius="xl" />
            <Skeleton height={12} width="50%" mb="md" radius="xl" />
            <Skeleton height={9} mt={6} radius="xl" />
            <Skeleton height={9} mt={6} radius="xl" />
        </div>
    );
}

export function CardWikiList({ id, title, description, coverImage, tag }) {
    const useStyles = createStyles((theme) => ({
        /*wrapper: {
            display: "flex",
            alignItems: "center",
            padding: `calc(${theme.spacing.xl} * 2)`,
            borderRadius: theme.radius.md,
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.white,
            border: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[3]
            }`,

            [theme.fn.smallerThan("sm")]: {
                flexDirection: "column-reverse",
                padding: theme.spacing.xl,
            },
        },*/

        wrapper: {
            display: "flex",
            gap: "2em",
            flexDirection: "row",
            alignItems: "stretch",
            width: "100%",
            //height: "5em",
            padding: "2em",
            margin: "1px",
            "&:hover": {
                //border: "1px solid teal",
                //borderRadius: "5px",
                //textDecoration: "underline",
                //transition: "0.5s",
                //cursor: "pointer",
            },
        },

        left: {
            flex: 1,
        },

        image: {
            maxWidth: "30%",

            [theme.fn.smallerThan("sm")]: {
                maxWidth: "100%",
            },
            "&:hover": {
                transform: "scale(1.1)",

                //textDecoration: "underline",
                transition: "0.1s",
                //cursor: "pointer",
            },
        },

        body: {
            minWidth: "60%",
            paddingRight: `calc(${theme.spacing.xl} * 4)`,

            [theme.fn.smallerThan("sm")]: {
                paddingRight: 0,
                marginTop: theme.spacing.xl,
            },
        },

        title: {
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            lineHeight: 1,
            marginBottom: theme.spacing.md,
            "&:hover": {
                //border: "1px solid",
                textDecoration: "underline",
                transition: "0.5s",
                cursor: "pointer",
            },
        },

        controls: {
            display: "flex",
            marginTop: theme.spacing.xl,
        },

        inputWrapper: {
            width: "100%",
            flex: "1",
        },

        input: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: 0,
        },

        control: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
    }));

    const { classes } = useStyles();

    const getTagColor = () => {
        if (tag === "public_figure") {
            return "blue";
        }
        if (tag === "hero") {
            return "green";
        }
        if (tag === "martyr") {
            return "teal";
        }

        return "gray";
    };

    return (
        <div className={classes.wrapper}>
            <div spacing={2} className={classes.left}>
                <Badge c={getTagColor()}>{tag}</Badge>
                <Link
                    //legacyBehavior
                    href={`/wiki/${id}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    //className={classes.treeLink}
                    style={{ textDecoration: "none" }}
                >
                    <Text fw={700} fz="xl" className={classes.title}>
                        {title}
                    </Text>
                </Link>
                <Text fz="md" c="dimmed" lineClamp={4}>
                    {description}
                </Text>
            </div>

            <Image
                height={160}
                width={150}
                src={coverImage}
                className={classes.image}
                alt="img eleven"
            />
        </div>
    );
}
