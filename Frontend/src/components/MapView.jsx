import { useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = mapboxToken;

const createSvgMarker = () => {
  const div = document.createElement("div");

  div.innerHTML = `
    <svg width="36" height="36" viewBox="0 0 27 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 0C6.04 0 0 6.04 0 13.5C0 19.22 6.75 27 12.25 34.5C12.98 35.5 14.02 35.5 14.75 34.5C20.25 27 27 19.22 27 13.5C27 6.04 20.96 0 13.5 0Z"
        fill="#7b6f19"
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
  const hasCoordinates = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

  useEffect(() => {
    if (!mapContainerRef.current || !hasCoordinates || !mapboxToken) return;

    try {
      if (!mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [Number(lng), Number(lat)],
          zoom: 13,
        });
      }

      const map = mapRef.current;

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
        .setLngLat([Number(lng), Number(lat)])
        .setPopup(popup)
        .addTo(map);

      map.flyTo({ center: [Number(lng), Number(lat)], zoom: 13 });
    } catch (error) {
      console.error("Map failed to load", error);
    }
  }, [lat, lng, label, hasCoordinates]);

  if (!hasCoordinates || !mapboxToken) {
    return (
      <Box
        sx={{
          mt: 1,
          minHeight: { xs: 220, md: 280 },
          display: "grid",
          placeItems: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "surface.containerLow",
          textAlign: "center",
          px: 3,
        }}
      >
        <Stack spacing={1} alignItems="center">
          <LocationOnOutlined color="primary" />
          <Typography fontWeight={700}>{label}</Typography>
          {hasCoordinates ? (
            <Typography variant="body2" color="text.secondary">
              Coordinates: {Number(lat).toFixed(5)}, {Number(lng).toFixed(5)}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Pickup coordinates are not available.
            </Typography>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      <Box
        ref={mapContainerRef}
        sx={{
          width: "100%",
          height: { xs: 320, md: 420 },
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 2px rgba(38, 20, 6, 0.08)",
        }}
      />
    </Box>
  );
};

export default MapView;
