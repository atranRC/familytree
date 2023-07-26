import { Box, Loader, ScrollArea, TextInput, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

export default function LocationAutocomplete({
    selectedLocation,
    setSelectedLocation,
    locationError,
    setLocationError,
    label = "Location",
    placeholder = "Enter location name",
    desc = "Select location from the dropdown suggestions",
    id = "def",
}) {
    const [locationInputValue, setLocationInputValue] = useState("");
    const [suggestionOpen, setSuggestionOpen] = useState(false);
    const textInputRef = useRef(null);

    const getLocations = useQuery({
        queryKey: ["get-locations", id],
        queryFn: () => {
            return axios.get(
                `https://nominatim.openstreetmap.org/search?q=${locationInputValue}&format=json`
            );
        },
        enabled: false,
        onSuccess: (d) => {
            //console.log(d.data);
            /*const cit = d.data.map((d) => {
                return {
                    value: d.display_name,
                    lat: d.lat,
                    lon: d.lon,
                };
            });
            setFetchedLocs(cit);*/
        },
    });

    const handleLocationSelect = (loc) => {
        setSelectedLocation({
            value: loc.display_name,
            lat: loc.lat,
            lon: loc.lon,
        });
        setLocationInputValue(loc.display_name);
        setSuggestionOpen(false);
    };
    useEffect(() => {
        if (locationInputValue.length === 0) {
            setSuggestionOpen(false);
            setSelectedLocation(null);
        }
        const r = () => {
            getLocations.refetch();
        };
        r();
        setTimeout(() => {
            r();
        }, 2000);
    }, [locationInputValue]);

    if (getLocations.error) return <div>error</div>;
    return (
        <Box>
            <TextInput
                label={label}
                placeholder={placeholder}
                description={desc}
                value={locationInputValue}
                onChange={(e) => {
                    setSuggestionOpen(true);
                    setLocationInputValue(e.currentTarget.value);
                }}
                onKeyDown={(e) => {
                    if (e.code === "Enter") {
                        getLocations.refetch();
                    }
                }}
                error={locationError && "please select a location"}
                onFocus={() => setLocationError(false)}
            />

            {getLocations.isLoading ? (
                <Loader />
            ) : (
                <div>
                    {suggestionOpen && (
                        <ScrollArea h={250}>
                            <Box
                                sx={{
                                    marginTop: "5px",
                                    padding: "10px",
                                    border: "1px solid lightgray",
                                    borderRadius: "5px",
                                }}
                            >
                                {getLocations.isFetching && (
                                    <Text align="center">⏳</Text>
                                )}
                                {!getLocations.isFetching && (
                                    <Text align="center">📌</Text>
                                )}
                                {getLocations.data?.data.map((loc) => {
                                    return (
                                        <Box
                                            key={loc.place_id}
                                            onClick={() =>
                                                handleLocationSelect(loc)
                                            }
                                            sx={{
                                                padding: "5px",
                                                "&:hover": {
                                                    cursor: "pointer",
                                                    //border: "1px solid lightgray",
                                                    borderRadius: "5px",
                                                    backgroundColor: "#F8F9FA",
                                                },
                                            }}
                                        >
                                            {loc.display_name}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </ScrollArea>
                    )}
                </div>
            )}
        </Box>
    );
}
