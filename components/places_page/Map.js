import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Button, Modal } from "@mantine/core";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Link from "next/link";

export default function Map({
    markers,
    setSelectedMarkerId,
    setModalOpen,
    withPopup = false,
    onOpenLink = () => {},
}) {
    const eventsIconUrl = "/event.png";
    const writtenStoriesIconUrl = "/pencil.png";
    const audioStoriesIconUrl = "/mic_loc.png";
    const defaultIconUrl = `https://cdn-icons-png.flaticon.com/512/7976/7976202.png`;

    /*const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/7976/7976202.png",
        //iconUrl:
        //"https://www.flaticon.com/download/icon/3293623?icon_id=3293623&author=681&team=681&keyword=Voice&pack=3293569&style=Flat+Gradient&style_id=1279&format=png&color=%23000000&colored=2&size=512%2C256%2C128%2C64%2C32%2C24%2C16&selection=1&type=standard&search=microphone",
        iconSize: [38, 38],
    });*/
    const center = markers[0] ? markers[0].geoloc : [13.4966644, 39.4768259];
    const [opened, setOpened] = useState(false);
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <MapContainer center={center} zoom={5}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                    {markers.map((marker) => {
                        let cus_ic = defaultIconUrl;
                        if (marker.type === "event") {
                            cus_ic = eventsIconUrl;
                        }
                        if (marker.type === "audioStory") {
                            cus_ic = audioStoriesIconUrl;
                        }
                        if (marker.type === "writtenStory") {
                            cus_ic = writtenStoriesIconUrl;
                        }

                        return (
                            <Marker
                                key={marker.id}
                                position={marker.geoloc}
                                icon={
                                    new Icon({
                                        iconUrl: cus_ic,
                                        iconSize: [38, 38],
                                    })
                                }
                            >
                                {withPopup && (
                                    <Popup>
                                        <p>{marker.popup}</p>
                                    </Popup>
                                )}
                            </Marker>
                        );
                    })}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}
//http://localhost:3000/profiles/6437eaa66de1295a1aabfa5e/events?contentId=6576b266c19ba0111a9218c0
