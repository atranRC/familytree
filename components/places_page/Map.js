import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Button, Modal } from "@mantine/core";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

export default function Map({ markers, setSelectedMarkerId, setModalOpen }) {
    const customIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/7976/7976202.png",
        iconSize: [38, 38],
    });
    const center = markers[0] ? markers[0].geoloc : [38.7321749, 14.1220982];
    const [opened, setOpened] = useState(false);
    return (
        <div>
            <div style={{ height: "300px", width: "100%" }}>
                <MapContainer center={center} zoom={5}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup>
                        {markers.map((marker) => {
                            return (
                                <Marker
                                    key={marker.id}
                                    position={marker.geoloc}
                                    icon={customIcon}
                                >
                                    <Popup>
                                        <p>{marker.popup}</p>
                                        <p
                                            style={{
                                                color: "blue",
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setSelectedMarkerId(marker.id);
                                                setModalOpen(true);
                                            }}
                                        >
                                            view more
                                        </p>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
        </div>
    );
}
