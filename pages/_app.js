import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import NextNProgress from "nextjs-progressbar";
import { QueryClientProvider, QueryClient } from "react-query";

import "../styles/globals.css";
//import "vis-timeline/dist/vis-timeline-graph2d.min.css";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const queryClient = new QueryClient();
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        /** Put your mantine theme override here */
                        colorScheme: "light",
                    }}
                >
                    <NextNProgress color="#fcba03" />
                    <Component {...pageProps} />
                </MantineProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
