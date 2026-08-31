import React, { createContext, useContext, useState } from "react";

// Shared Mauritius/Mayotte region selection so the redesigned header
// (Calendar-only toggle) and MURCalendar.jsx read/write the same value
// instead of the toggle living inside the page body. Mirrors the previous
// behavior: seeded once from localStorage("UserCountry"), not persisted
// back on change (that was already the case before this move).
const RegionContext = createContext(null);

export const RegionProvider = ({ children }) => {
  const [region, setRegion] = useState(
    window.localStorage.getItem("UserCountry") || ""
  );
  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
};

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used within a RegionProvider");
  return ctx;
}
