import React, { useEffect } from "react";
import L from "leaflet";

const TashkentMap: React.FC = () => {
    useEffect(() => {
    const map = L.map("map").setView([41.2995, 69.2401], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([41.2995, 69.2401]).addTo(map).bindPopup("Tashkent").openPopup();

    map.on("click", (e) => {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        alert(`Tanlangan joy: Latitude: ${lat}, Longitude: ${lng}`);
    });
    }, []);

    return (
        <div>
            <h2>Tashkent Interaktiv Xarita</h2>
            <div id="map" style={{ height: "400px", width: "600px" }}></div>
        </div>
    );
};

export default TashkentMap;
