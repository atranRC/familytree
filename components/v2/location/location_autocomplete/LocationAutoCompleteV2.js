import { Box, Loader, ScrollArea, TextInput, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

export default function LocationAutocompleteV2({
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
        queryKey: ["get-locations", id, locationInputValue],
        queryFn: () => {
            return axios.get(
                `https://nominatim.openstreetmap.org/search?q=${locationInputValue}&format=json`
            );
        },
        refetchOnWindowFocus: false,
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
        setLocationError(false);
        setSelectedLocation({
            value: loc.display_name,
            lat: loc.lat,
            lon: loc.lon,
        });
        setLocationInputValue(loc.display_name);
        setSuggestionOpen(false);
    };

    return (
        <Box>
            <TextInput
                label={label}
                placeholder={placeholder}
                description={desc}
                value={locationInputValue}
                onChange={(e) => {
                    setSelectedLocation(null);
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

            <div>
                {suggestionOpen && locationInputValue !== "" && (
                    <Box
                        sx={{
                            maxHeight: "200px",
                            overflow: "scroll",
                        }}
                    >
                        <Box
                            sx={{
                                marginTop: "5px",
                                padding: "10px",
                                border: "1px solid lightgray",
                                borderRadius: "5px",
                            }}
                        >
                            {getLocations.error && (
                                <div>error fetching locations</div>
                            )}
                            {(getLocations.isFetching ||
                                getLocations.isLoading) && (
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
                                        <Text size="sm">
                                            {loc.display_name}
                                        </Text>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </div>
        </Box>
    );
}
