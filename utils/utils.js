export function truncateWord(str, len) {
    if (!str) {
        return "";
    }
    return `${str.slice(0, len)}${str.length > len ? "..." : ""}` || "";
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
                "These are the trees you have been invited to collaborate on.",
        };
    }

    if (filter === "treesImIn") {
        return {
            title: "Trees I'm In",
            subtitle: "These are the trees you are currently tagged on.",
        };
    }
    return {
        title: "My Trees",
        subtitle: `These are the Family Trees you created.`,
    };
}

export function getEventStoryMapMarker(eventOrStory = null) {
    let marker = [
        {
            id: "s",
            type: "unavailable",
            geoloc: ["8.5410261", "39.2705461"],
            popup: "unavailable",
        },
    ];
    if (eventOrStory) {
        marker = [
            {
                id: eventOrStory?._id.toString(),
                type: eventOrStory?.type,
                geoloc: [
                    /*eventOrStory?.location?.lat ? eventOrStory.location.lat : 0,
                    eventOrStory?.location?.lon ? eventOrStory.location.lon : 0,*/

                    eventOrStory?.location?.lat.$numberDecimal ||
                        eventOrStory?.location?.lat ||
                        0,
                    eventOrStory?.location?.lon.$numberDecimal ||
                        eventOrStory?.location?.lon ||
                        0,
                ],
                popup: truncateWord(eventOrStory?.description, 20),
            },
        ];
    }
    return marker;
}

export function getLifeStatusBasedColor(isAlive) {
    if (isAlive) return "#6f32be";
    if (!isAlive) return "#868E96";
    return "blue";
}
