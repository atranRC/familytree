import { Group, Paper, Tabs, TextInput } from "@mantine/core";
import {
    IconArrowAutofitRight,
    IconArrowForward,
    IconArrowRight,
    IconSearch,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./PublicTimelineNavbars.module.css";
import { useSession } from "next-auth/react";

export function PrimaryNavBar({ setQuerySearchTerm = null }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <Paper withBorder>
            <div className={styles.container}>
                <div>famtree</div>
                <div className={styles.searchBox}>
                    <TextInput
                        radius="xl"
                        placeholder="search"
                        rightSection={
                            <IconArrowRight
                                color="blue"
                                onClick={() => {
                                    if (searchTerm !== "") {
                                        if (setQuerySearchTerm !== null) {
                                            setQuerySearchTerm(searchTerm);
                                        } else {
                                            router.push(
                                                `/timeline/search?searchTerm=${searchTerm}`
                                            );
                                        }
                                    }
                                }}
                            />
                        }
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.currentTarget.value)
                        }
                    />
                </div>
                <Link href="/family-tree/tree/my-trees">Family Tree</Link>
            </div>
        </Paper>
    );
}

export function SecondaryNavbar({ activePage = "featured" }) {
    const router = useRouter();

    return (
        <Tabs
            value={activePage}
            onTabChange={(value) => {
                const url = `/${value}`;
                /*let url = `/profiles/${id}/${value}`;
                if (value === "drafts") {
                    url = `/profiles/${id}/my-articles/${value}`;
                }*/
                router.push(url);
            }}
        >
            <Tabs.List
                position="center"
                bg="white"
                p="md"
                style={{
                    border: "1px lightgray solid",
                    borderRadius: "5px",
                }}
            >
                <Tabs.Tab value="timeline"> Timeline</Tabs.Tab>
                <Tabs.Tab value="heros">Heros</Tabs.Tab>
            </Tabs.List>
        </Tabs>
    );
}
