import { Paper, Skeleton } from "@mantine/core";

export default function CardGridLoading({ size }) {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
            }}
        >
            {Array.from({ length: size }).map((_, index) => (
                <Paper withBorder p="md" key={index}>
                    <Skeleton height={200} width={200} />
                </Paper>
            ))}
        </div>
    );
}
