import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import { getMarkersByCountry } from "../../services/Events";
import { toast } from "react-toastify";

const defaultPositionMRU = [-20.348404, 57.552152]; // Coordinates for Mauritius
const defaultPositionMay = [-12.8275, 45.166244];

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

const MapComponent = ({ onOpen, update, country }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const fetchedMarkers = await getMarkersByCountry(country ?? "");
        toast.success(fetchedMarkers?.message);
        setMarkers(fetchedMarkers?.markers);
      } catch (error) {
        console.error("Error fetching Markers:", error);
      }
    };

    fetchMarkers();
  }, [!update, country]);

  const mapRef = useRef();

  const addMarker = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.display_name || "Unknown Address";

      onOpen({
        location: [lat, lng],
        address: address,
      });
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        addMarker(lat, lng);
      },
    });
    return null;
  };

  const defaultPosition =
    country === "MAY" ? defaultPositionMay : defaultPositionMRU;

  return (
    <MapContainer
      center={defaultPosition}
      zoom={11}
      scrollWheelZoom={false}
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      <RecenterAutomatically
        lat={defaultPosition[0]}
        lng={defaultPosition[1]}
      />
      {markers?.map((marker, index) => (
        <Marker
          key={index}
          position={marker.location}
          icon={
            new Icon({
              iconUrl: markerIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        >
          <Popup>
            <strong>{marker.title}</strong>
            <br />
            Address: {marker.address}
            <br />
            Start Date: {new Date(marker.start).toLocaleDateString()}{" "}
            {new Date(marker.start).toLocaleTimeString()}
            <br />
            End Date: {new Date(marker.end).toLocaleDateString()}{" "}
            {new Date(marker.end).toLocaleTimeString()}
            <br />
            Description: {marker.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
