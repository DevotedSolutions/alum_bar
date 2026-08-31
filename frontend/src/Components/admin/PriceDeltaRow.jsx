import React from "react";
import { Grid } from "@mui/material";
import PriceDelta from "./PriceDelta";

// Renders as a continuation of the parent price-row <Grid container> (same
// column widths as Largeur/Hauteur/Price MRU/Price MAY/Price REU/Price/
// checkbox), so it wraps onto its own line directly under those fields
// instead of a separate summary strip.
const COLUMNS = [
  { key: "mru", oldField: "price_old", newField: "price_local" },
  { key: "may", oldField: "price_may_old", newField: "price_may" },
  { key: "reu", oldField: "price_reu_old", newField: "price_reu" },
  { key: "price", oldField: "price_default_old", newField: "price" },
];

const PriceDeltaRow = ({ priceEntry }) => {
  const hasAnyOld = COLUMNS.some((col) => Number(priceEntry?.[col.oldField]));
  if (!hasAnyOld) return null;

  return (
    <>
      <Grid item xs={12} sm={1.5} />
      <Grid item xs={12} sm={1.5} />
      {COLUMNS.map((col) => (
        <Grid item xs={12} sm={2} key={col.key}>
          <PriceDelta
            oldValue={priceEntry?.[col.oldField]}
            newValue={priceEntry?.[col.newField]}
          />
        </Grid>
      ))}
      <Grid item xs={12} sm={1} />
    </>
  );
};

export default PriceDeltaRow;
