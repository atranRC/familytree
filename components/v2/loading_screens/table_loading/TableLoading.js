import { Paper, Skeleton } from "@mantine/core";

export default function TableLoading({ size }) {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",

                gap: "10px",
            }}
        >
            {Array.from({ length: size }).map((_, index) => (
                <Paper withBorder p="md" key={index}>
                    <Skeleton height={10} />
                </Paper>
            ))}
        </div>
    );
}
