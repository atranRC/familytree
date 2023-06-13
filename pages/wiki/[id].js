import {
    ActionIcon,
    Box,
    Button,
    Divider,
    Group,
    Loader,
    LoadingOverlay,
    Modal,
    RangeSlider,
    Stack,
    TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
//import { ArticleViewer } from "../../components/timeline_page_comps/article_viewer/ArticleViewer";
import { useRouter } from "next/router";
import { Shell } from "../../components/wiki/Shell";
import { WikiViewer } from "../../components/wiki_page/wiki_viewer/WikiViewer";

export default function TimelinePage({ asPath, query, pathname }) {
    useEffect(() => {
        console.log(asPath.split("/").at(-1));
    }, []);
    return (
        <Shell>
            <WikiViewer articleId={asPath.split("/").at(-1)} />
        </Shell>
    );
}

TimelinePage.getInitialProps = (ctx) => {
    const { asPath, query, pathname } = ctx;

    return { asPath, query, pathname };
};
