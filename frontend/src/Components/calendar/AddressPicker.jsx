import React, { useState } from "react";
import { Box } from "@mui/material";
import { Field, fieldInputStyle, fieldSelectStyle } from "../common/ModalKit";
import { COLORS } from "../../theme/tokens";

// Same geocoder the map search uses (Components/calendar/Map.jsx), restricted
// to the region being planned so a street name doesn't resolve to the other
// side of the world.
const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const countryCode = (country) => (country === "MAY" ? "yt" : "mu");

/**
 * Address row for the event modal: type an address, search it, pick a result.
 *
 * Picking a result stores both the label and its [lat, lng], and it is the
 * coordinates that put the event on the map - the markers endpoint only
 * returns events whose `location` holds two values. Before this, coordinates
 * could only come from clicking the map, so an event added from the calendar
 * never appeared there.
 */
const AddressPicker = ({ address, location, country, disabled, onChange }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const hasLocation = Array.isArray(location) && location.length === 2;

  const search = async () => {
    if (query.trim().length < 4) return;
    setSearching(true);
    setError("");
    try {
      const response = await fetch(
        `${NOMINATIM}?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=${countryCode(country)}&limit=8`
      );
      const data = await response.json();
      setResults(data || []);
      if (!data || data.length === 0) {
        setError("No match for that address — try a village, street or landmark.");
      }
    } catch (err) {
      setError("Address lookup failed. Check the connection and try again.");
    } finally {
      setSearching(false);
    }
  };

  const pick = (displayName) => {
    const hit = results.find((r) => r.display_name === displayName);
    if (!hit) return;
    onChange({
      address: hit.display_name,
      location: [Number(hit.lat), Number(hit.lon)],
    });
    setResults([]);
    setQuery("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Field label="Address (puts the event on the map)">
        <input
          disabled={disabled}
          placeholder="Street, village or landmark"
          value={address || ""}
          onChange={(e) => onChange({ address: e.target.value, location })}
          style={fieldInputStyle}
        />
      </Field>

      {!disabled && (
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            placeholder="Search an address to pin it on the map"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // The modal's form-less inputs would otherwise submit nothing;
                // Enter here should mean "search", not "save the event".
                e.preventDefault();
                search();
              }
            }}
            style={{ ...fieldInputStyle, flex: 1 }}
          />
          <Box
            component="button"
            type="button"
            onClick={search}
            disabled={searching || query.trim().length < 4}
            sx={{
              height: "42px",
              padding: "0 18px",
              border: "none",
              borderRadius: "6px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "#fff",
              background: COLORS.headerTeal,
              cursor: "pointer",
              whiteSpace: "nowrap",
              "&:disabled": { background: "#B7C0C6", cursor: "default" },
              "&:hover:not(:disabled)": { background: COLORS.headerTealHover },
            }}
          >
            {searching ? "Searching…" : "Search"}
          </Box>
        </Box>
      )}

      {results.length > 0 && (
        <select
          defaultValue=""
          onChange={(e) => pick(e.target.value)}
          style={fieldSelectStyle}
        >
          <option value="" disabled>
            {results.length} match{results.length === 1 ? "" : "es"} — select one
          </option>
          {results.map((r) => (
            <option key={r.place_id} value={r.display_name}>
              {r.display_name}
            </option>
          ))}
        </select>
      )}

      {error && (
        <Box sx={{ fontSize: "12.5px", color: "#D22D3A" }}>{error}</Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <Box
          sx={{
            fontSize: "12.5px",
            color: hasLocation ? COLORS.groupRowFg : COLORS.textFaint,
            background: hasLocation ? COLORS.accentTealTint : COLORS.neutralChipBg,
            border: `1px solid ${hasLocation ? COLORS.accentTealBorder : COLORS.inputBorder}`,
            borderRadius: "5px",
            padding: "5px 10px",
          }}
        >
          {hasLocation
            ? `Pinned at ${Number(location[0]).toFixed(5)}, ${Number(location[1]).toFixed(5)}`
            : "Not on the map — search an address to pin it"}
        </Box>
        {hasLocation && !disabled && (
          <Box
            component="button"
            type="button"
            onClick={() => onChange({ address: address || "", location: null })}
            sx={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "12.5px",
              color: COLORS.textMuted,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Remove pin
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddressPicker;
