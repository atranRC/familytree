export function truncateWord(str, len) {
    return `${str.slice(0, len)}...` || "";
}
export function getPillColorClaimReq(status) {
    if (status === "approved") return "green";
    if (status === "pending") return "blue";
    if (status === "declined") return "red";
    return "gray";
}

export function getMyTreesPageTitle(filter) {
    if (filter === "myCollabs") {
        return {
            title: "My Collaborations",
            subtitle:
                "These are the trees you've been invited to collaborate on.",
        };
    }

    if (filter === "treesImIn") {
        return {
            title: "Trees I'm In",
            subtitle: "These are the trees you're currently tagged in.",
        };
    }
    return {
        title: "My Trees",
        subtitle: `These are the trees you've created.`,
    };
}
