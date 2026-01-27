import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Custom SVG food marker (RED)
const createSvgMarker = () => {
  const div = document.createElement("div");

  div.innerHTML = `
    <svg width="36" height="36" viewBox="0 0 27 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 0C6.04 0 0 6.04 0 13.5C0 19.22 6.75 27 12.25 34.5C12.98 35.5 14.02 35.5 14.75 34.5C20.25 27 27 19.22 27 13.5C27 6.04 20.96 0 13.5 0Z"
        fill="#dc2626"
      />
      <circle cx="13.5" cy="13.5" r="5.5" fill="white"/>
    </svg>
  `;

  div.style.cursor = "pointer";
  return div;
};

const MapView = ({ lat, lng, label }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !lat || !lng) return;

    // Initialize map once
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: 13,
      });
    }

    const map = mapRef.current;

    // Remove previous marker if exists
    if (markerRef.current) {
      markerRef.current.remove();
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <strong>${label}</strong><br/>
      <small>
        Enter your location to see distance.<br/>
        Contact details shared after approval.
      </small>
    `);

    markerRef.current = new mapboxgl.Marker(createSvgMarker())
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    // Center map properly
    map.flyTo({ center: [lng, lat], zoom: 13 });

  }, [lat, lng, label]);

  return (
    <div className="flex my-6">
      <div
        ref={mapContainerRef}
        className="rounded-lg border shadow"
        style={{ width: "500px", height: "500px" }}
      />
    </div>
  );
};

export default MapView;