import React, { useId } from "react";
import { COLORS } from "../../theme/tokens";

/**
 * 20ft container loaded with 5800 mm aluminium profiles.
 *
 * The load is a *height* problem, not a length one: a 5.8 m profile already
 * runs the full internal length of a 20ft box (~5.9 m), so a shipment fills up
 * by stacking layers from the floor towards the roof. The drawing follows that
 * - bundles span the whole internal length (they recede to the vanishing point
 * inside the open end), they stack from the floor to `pct` of the internal
 * height, whatever is left is one continuous empty band above them, and the
 * percentage is called out on a vertical scale so the number reads as
 * occupied height rather than as a bar someone has to re-interpret.
 *
 * Projection: the open end faces the viewer, the body runs back to the right
 * (oblique), and the interior recedes in one-point perspective towards a
 * vanishing point inside the opening - a box is only see-through within the
 * outline of its opening, so everything interior is drawn inside that quad.
 */

// --- Exterior box ---------------------------------------------------------
const FX1 = 24; // open end, left
const FX2 = 150; // open end, right
const FY1 = 42; // open end, top
const FY2 = 196; // open end, bottom
const DX = 190; // depth vector: back and to the right
const DY = -34;

// --- Opening / interior ---------------------------------------------------
const FRAME = 10; // door frame thickness around the opening
const OX1 = FX1 + FRAME;
const OX2 = FX2 - FRAME;
const OY1 = FY1 + FRAME;
const OY2 = FY2 - FRAME;
const INNER_H = OY2 - OY1;

// Vanishing point, kept inside the opening and right of centre so the load is
// seen running away from the doors. T is how far back the end wall sits.
const VP_X = OX2 - 10;
const VP_Y = (OY1 + OY2) / 2 + 8;
const T = 0.5;

const toVp = (x, y) => [x + T * (VP_X - x), y + T * (VP_Y - y)];
const [BX1, BY1] = toVp(OX1, OY1); // interior end wall, top-left
const [BX2, BY2] = toVp(OX2, OY2); // interior end wall, bottom-right
const BACK_H = BY2 - BY1;

// One bundle of profiles: a strapped layer, not a single extrusion.
const BUNDLE_H = 12;
const BUNDLE_GAP = 2;

const lerp = (a, b, t) => a + (b - a) * t;

const ContainerLoadGraphic = ({ pct = 0, width = 380 }) => {
  // Gradients and clips are referenced by id, so they have to be unique per
  // instance - fixed ids would make a second graphic reuse the first's.
  const uid = useId().replace(/:/g, "");
  const id = (name) => `${name}-${uid}`;

  const filled = Math.max(0, Math.min(100, Number(pct) || 0));
  const empty = 100 - filled;

  // Load line, at the doors and again at the far end wall.
  const fillFront = OY2 - (INNER_H * filled) / 100;
  const fillBack = BY2 - (BACK_H * filled) / 100;

  // Bundles are laid out for the full interior height and then clipped to the
  // filled band, so the topmost layer is cut at exactly `pct`.
  const bundles = [];
  for (let y = OY2 - BUNDLE_H; y >= OY1 - BUNDLE_H; y -= BUNDLE_H + BUNDLE_GAP) {
    bundles.push(y);
  }

  // Corrugation across the long side wall, following the depth skew.
  const ribs = [];
  for (let i = 1; i < 15; i += 1) {
    const t = i / 15;
    ribs.push([
      lerp(FX2, FX2 + DX, t),
      lerp(FY1, FY1 + DY, t),
      lerp(FX2, FX2 + DX, t),
      lerp(FY2, FY2 + DY, t),
    ]);
  }

  // Roof ribs run the other way - along the length of the box.
  const roofRibs = [];
  for (let i = 1; i < 7; i += 1) {
    const t = i / 7;
    roofRibs.push([
      lerp(FX1, FX2, t),
      FY1,
      lerp(FX1 + DX, FX2 + DX, t),
      FY1 + DY,
    ]);
  }

  // Vertical scale, drawn against the far end of the box.
  const SCALE_X = 368;
  const scaleTop = OY1 + DY;
  const scaleBottom = OY2 + DY;
  const scaleSplit = fillFront + DY;

  const bracket = (yTop, yBottom, label, color) => {
    if (yBottom - yTop < 12) {
      // Too thin for arrowheads - just label the band.
      return (
        <text
          x={SCALE_X + 9}
          y={(yTop + yBottom) / 2 + 4.5}
          fontSize="12.5"
          fontWeight="700"
          fill={color}
        >
          {Math.round(label)}%
        </text>
      );
    }
    return (
      <g>
        <line x1={SCALE_X} y1={yTop} x2={SCALE_X} y2={yBottom} stroke={color} strokeWidth="1.5" />
        <path
          d={`M${SCALE_X - 4} ${yTop + 5}L${SCALE_X} ${yTop}L${SCALE_X + 4} ${yTop + 5}`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M${SCALE_X - 4} ${yBottom - 5}L${SCALE_X} ${yBottom}L${SCALE_X + 4} ${yBottom - 5}`}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x={SCALE_X + 9}
          y={(yTop + yBottom) / 2 + 5}
          fontSize="14"
          fontWeight="700"
          fill={color}
        >
          {Math.round(label)}%
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 420 232"
      width={width}
      role="img"
      aria-label={`20ft container loaded to ${Math.round(filled)} percent of its internal height`}
      style={{ display: "block", width: "100%", maxWidth: `${width}px`, height: "auto" }}
    >
      <defs>
        <linearGradient id={id("side")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E8A96" />
          <stop offset="0.62" stopColor="#14727E" />
          <stop offset="1" stopColor="#0C4E5B" />
        </linearGradient>
        <linearGradient id={id("roof")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2A96A2" />
          <stop offset="1" stopColor="#1B7C88" />
        </linearGradient>
        <linearGradient id={id("bundle")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F5F7" />
          <stop offset="0.35" stopColor="#D3DCE1" />
          <stop offset="1" stopColor="#A9B6BE" />
        </linearGradient>
        <linearGradient id={id("bundleTop")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E8EDF0" />
          <stop offset="1" stopColor="#9EACB5" />
        </linearGradient>
        <linearGradient id={id("depth")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0B3A44" />
          <stop offset="1" stopColor="#06222A" />
        </linearGradient>

        {/* Everything load-shaped is drawn full height, then clipped here. */}
        <clipPath id={id("fill")}>
          <rect x={OX1 - 1} y={fillFront} width={OX2 - OX1 + 2} height={OY2 - fillFront + 1} />
          <polygon
            points={`${OX1},${fillFront} ${BX1},${fillBack} ${BX2},${fillBack} ${OX2},${fillFront}`}
          />
        </clipPath>
        <clipPath id={id("opening")}>
          <rect x={OX1} y={OY1} width={OX2 - OX1} height={INNER_H} />
        </clipPath>
      </defs>

      {/* Ground shadow */}
      <ellipse cx={(FX1 + FX2 + DX) / 2} cy={FY2 + 8} rx={(FX2 + DX - FX1) / 2 - 8} ry="7" fill="#22272E" opacity="0.1" />

      {/* Long side wall, corrugated */}
      <polygon
        points={`${FX2},${FY1} ${FX2 + DX},${FY1 + DY} ${FX2 + DX},${FY2 + DY} ${FX2},${FY2}`}
        fill={`url(#${id("side")})`}
      />
      {ribs.map(([x1, y1, x2, y2]) => (
        <g key={x1}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0B4B57" strokeWidth="2.2" opacity="0.35" />
          <line x1={x1 + 3.5} y1={y1} x2={x2 + 3.5} y2={y2} stroke="#35A9B5" strokeWidth="1.6" opacity="0.22" />
        </g>
      ))}
      {/* Top and bottom rails of the side wall */}
      <line x1={FX2} y1={FY1 + 5} x2={FX2 + DX} y2={FY1 + DY + 5} stroke="#0B4B57" strokeWidth="5" opacity="0.75" />
      <line x1={FX2} y1={FY2 - 5} x2={FX2 + DX} y2={FY2 + DY - 5} stroke="#0A404B" strokeWidth="6" opacity="0.85" />

      {/* Roof */}
      <polygon
        points={`${FX1},${FY1} ${FX2},${FY1} ${FX2 + DX},${FY1 + DY} ${FX1 + DX},${FY1 + DY}`}
        fill={`url(#${id("roof")})`}
      />
      {roofRibs.map(([x1, y1, x2, y2]) => (
        <line key={x1} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#12707C" strokeWidth="1.6" opacity="0.6" />
      ))}

      {/* Door frame around the open end */}
      <rect x={FX1} y={FY1} width={FX2 - FX1} height={FY2 - FY1} fill="#136D79" />
      <rect x={FX1} y={FY1} width={FX2 - FX1} height={FY2 - FY1} fill="none" stroke="#0B4B57" strokeWidth="2" />
      <rect x={FX1 + 3.5} y={FY1 + 3.5} width={FX2 - FX1 - 7} height={FY2 - FY1 - 7} fill="none" stroke="#0E5B67" strokeWidth="2" />

      {/* Corner castings */}
      {[
        [FX1 - 1, FY1 - 1],
        [FX2 - 9, FY1 - 1],
        [FX1 - 1, FY2 - 9],
        [FX2 - 9, FY2 - 9],
        [FX2 + DX - 9, FY1 + DY - 1],
        [FX2 + DX - 9, FY2 + DY - 9],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="10" height="10" rx="1.5" fill="#0A444F" />
      ))}

      {/* --- Interior, seen through the opening --- */}
      <g clipPath={`url(#${id("opening")})`}>
        {/* End wall, ceiling, floor and left wall of the empty box */}
        <rect x={OX1} y={OY1} width={OX2 - OX1} height={INNER_H} fill={`url(#${id("depth")})`} />
        <polygon points={`${OX1},${OY1} ${OX2},${OY1} ${BX2},${BY1} ${BX1},${BY1}`} fill="#0A333C" />
        <polygon points={`${OX1},${OY1} ${BX1},${BY1} ${BX1},${BY2} ${OX1},${OY2}`} fill="#0D4049" />
        <polygon points={`${OX1},${OY2} ${OX2},${OY2} ${BX2},${BY2} ${BX1},${BY2}`} fill="#07272F" />
        <rect x={BX1} y={BY1} width={BX2 - BX1} height={BY2 - BY1} fill="#092C34" />

        {/* Load: stacked bundles running the full internal length */}
        <g clipPath={`url(#${id("fill")})`}>
          {/* Left flank of the stack, receding towards the end wall */}
          <polygon
            points={`${OX1},${fillFront} ${BX1},${fillBack} ${BX1},${BY2} ${OX1},${OY2}`}
            fill="#7E8C95"
          />
          {/* Top of the stack - individual profiles running to the far end */}
          <polygon
            points={`${OX1},${fillFront} ${OX2},${fillFront} ${BX2},${fillBack} ${BX1},${fillBack}`}
            fill={`url(#${id("bundleTop")})`}
          />
          {[0.14, 0.3, 0.46, 0.62, 0.78, 0.92].map((t) => (
            <line
              key={t}
              x1={lerp(OX1, OX2, t)}
              y1={fillFront}
              x2={lerp(BX1, BX2, t)}
              y2={fillBack}
              stroke="#7F8D96"
              strokeWidth="0.8"
              opacity="0.8"
            />
          ))}

          {/* Cut ends of each bundle at the doors */}
          {bundles.map((y, i) => (
            <g key={y}>
              <rect x={OX1} y={y} width={OX2 - OX1} height={BUNDLE_H} fill={`url(#${id("bundle")})`} />
              <rect x={OX1} y={y} width={OX2 - OX1} height="1.6" fill="#FAFCFD" opacity="0.85" />
              <rect x={OX1} y={y + BUNDLE_H - 1.4} width={OX2 - OX1} height="1.4" fill="#8A99A2" />
              {/* profile cross-sections within the bundle */}
              {[0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84].map((t) => (
                <line
                  key={t}
                  x1={lerp(OX1, OX2, t)}
                  y1={y + 1.4}
                  x2={lerp(OX1, OX2, t)}
                  y2={y + BUNDLE_H - 1.4}
                  stroke="#94A3AC"
                  strokeWidth="0.7"
                  opacity="0.75"
                />
              ))}
              {/* every third bundle is strapped */}
              {i % 3 === 1 && (
                <rect x={OX1 + 14} y={y} width="3" height={BUNDLE_H} fill="#5E6B74" opacity="0.55" />
              )}
            </g>
          ))}
        </g>

        {/* Shading inside the doorway, so the opening reads as a cavity */}
        <rect x={OX1} y={OY1} width={OX2 - OX1} height={INNER_H} fill="none" stroke="#04181E" strokeWidth="3" opacity="0.5" />
      </g>

      {/* Load line, carried onto the far end of the box for the scale */}
      <line x1={OX1} y1={fillFront} x2={OX2} y2={fillFront} stroke={COLORS.headerTeal} strokeWidth="1.4" opacity="0.9" />
      <line
        x1={FX2}
        y1={fillFront}
        x2={FX2 + DX}
        y2={scaleSplit}
        stroke="#8FD6DC"
        strokeWidth="1.2"
        strokeDasharray="4 4"
        opacity="0.75"
      />

      {/* Vertical scale: occupied height below the load line, free above it */}
      <line x1={FX2 + DX} y1={scaleTop} x2={SCALE_X + 5} y2={scaleTop} stroke="#C3CBD1" strokeWidth="1" />
      <line x1={FX2 + DX} y1={scaleSplit} x2={SCALE_X + 5} y2={scaleSplit} stroke="#C3CBD1" strokeWidth="1" />
      <line x1={FX2 + DX} y1={scaleBottom} x2={SCALE_X + 5} y2={scaleBottom} stroke="#C3CBD1" strokeWidth="1" />
      {empty >= 1 && bracket(scaleTop, scaleSplit, empty, COLORS.textMuted)}
      {filled >= 1 && bracket(scaleSplit, scaleBottom, filled, COLORS.headerTeal)}

      {/* Internal length the profiles run along */}
      <line x1={FX1} y1={FY2 + 16} x2={FX2 + DX} y2={FY2 + 16} stroke="#C3CBD1" strokeWidth="1" />
      <line x1={FX1} y1={FY2 + 12} x2={FX1} y2={FY2 + 20} stroke="#C3CBD1" strokeWidth="1" />
      <line x1={FX2 + DX} y1={FY2 + 12} x2={FX2 + DX} y2={FY2 + 20} stroke="#C3CBD1" strokeWidth="1" />
      <text
        x={(FX1 + FX2 + DX) / 2}
        y={FY2 + 31}
        fontSize="11"
        fontWeight="600"
        fill={COLORS.textMuted}
        textAnchor="middle"
      >
        5800 mm profiles, full internal length
      </text>
    </svg>
  );
};

export default ContainerLoadGraphic;
