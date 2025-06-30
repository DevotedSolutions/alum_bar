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
import { TextField, Button } from "@mui/material";

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
  const [address, setAddress] = useState("");
  const [options, setOptions] = useState([]);
  const [searched, setSearched] = useState(false);

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

  const geocodeAddress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&countrycodes=${country === "MRU" ? "mu" : "yt"}&limit=5`
      );
      setSearched(true);
      const data = await response.json();

      if (data.length > 0) {
        setOptions(data);
        //addMarker(data[0].lat, data[0].lon);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
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
    <>
      <TextField
        label="Write to search Address"
        variant="outlined"
        fullWidth
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ margin: "10px 0" }}
      />

      <Button
        variant="contained"
        color="primary"
        disabled={address.length < 4}
        onClick={geocodeAddress}
        style={{ marginBottom: "10px" }}
      >
        Search
      </Button>

      <TextField
        select
        variant="outlined"
        fullWidth
        SelectProps={{
          native: true,
        }}
        onChange={(e) => {
          const selectedOption = options.find(
            (option) => option.display_name === e.target.value
          );
          if (selectedOption) {
            addMarker(selectedOption.lat, selectedOption.lon);
          }
        }}
        style={{ marginBottom: "10px" }}
      >
        <option value="">
          {options?.length > 0 ? "" : "Search to "} select an address
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.display_name}>
            {option.display_name}
          </option>
        ))}
      </TextField>

      <MapContainer
        center={defaultPosition}
        zoom={11}
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
    </>
  );
};

export default MapComponent;
