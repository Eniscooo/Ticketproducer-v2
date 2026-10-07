/**
 * A top-down venue on a 400×300 canvas, drawn in the order an event comes
 * together. Every piece that appears carries a `data-at` scroll threshold
 * (0–1); `EventManagement` adds `.on` as progress passes it, and the `.fx-*`
 * classes in globals.css do the motion. The hall outline is the exception: it
 * draws continuously with scroll, so it is driven directly through
 * `strokeDashoffset` via `hallRef`.
 *
 * Tables and chairs are generated from the positions below rather than written
 * out: eleven rounds of six, placed clear of the stage, the dance floor, the
 * vendor tags, and the palette.
 */

const HALL =
  "M42 20H358A22 22 0 0 1 380 42V258A22 22 0 0 1 358 280H42A22 22 0 0 1 20 258V42A22 22 0 0 1 42 20Z";

/** Table centres, in drop-in order: front rows first, back corners last. */
const TABLE_CENTRES: readonly [number, number][] = [
  [70, 105],
  [115, 105],
  [285, 105],
  [330, 105],
  [70, 165],
  [115, 165],
  [200, 165],
  [285, 165],
  [330, 165],
  [135, 228],
  [265, 228],
];

const SEATS_PER_TABLE = 6;
const CHAIR_RING = 16;

/** Planning: tables drop in across this slice, then the tags pin on. */
const TABLES_FROM = 0.47;
const TABLE_STEP = 0.014;
/** Delivery: chairs turn gold one after another across this slice. */
const CHAIRS_FROM = 0.76;
const CHAIRS_SPAN = 0.18;

const TABLES = TABLE_CENTRES.map(([x, y], t) => ({
  x,
  y,
  at: TABLES_FROM + t * TABLE_STEP,
  chairs: Array.from({ length: SEATS_PER_TABLE }, (_, s) => {
    const angle = (s / SEATS_PER_TABLE) * Math.PI * 2 - Math.PI / 2;
    const seat = t * SEATS_PER_TABLE + s;
    return {
      x: +(x + Math.cos(angle) * CHAIR_RING).toFixed(2),
      y: +(y + Math.sin(angle) * CHAIR_RING).toFixed(2),
      at: +(
        CHAIRS_FROM +
        (seat / (TABLE_CENTRES.length * SEATS_PER_TABLE)) * CHAIRS_SPAN
      ).toFixed(4),
    };
  }),
}));

const SWATCHES = [
  { x: 326, fill: "#b08d57", at: 0.37 },
  { x: 344, fill: "#8f3b4f", at: 0.395 },
  { x: 362, fill: "#f2eee6", at: 0.42 },
];

const TAGS = [
  { label: "Lighting", x: 32, y: 34, w: 54, at: 0.63 },
  { label: "Sound", x: 322, y: 34, w: 46, at: 0.655 },
  { label: "Catering", x: 32, y: 256, w: 58, at: 0.68 },
];

export function FloorPlan({ hallRef }: { hallRef: React.RefObject<SVGPathElement | null> }) {
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label="A venue floor plan: hall, stage, dance floor, eleven round tables of six, and vendor tags for lighting, sound, and catering."
      className="block h-auto max-h-[calc(100svh-19rem)] w-full motion-reduce:max-h-none"
    >
      <defs>
        <clipPath id="fp-hall-clip">
          <path d={HALL} />
        </clipPath>
        <radialGradient id="fp-warm">
          <stop offset="0%" stopColor="#f6cf8e" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#d4af7a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#d4af7a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Design — the floor takes colour */}
      <path d={HALL} fill="#b08d57" fillOpacity="0.1" className="fx-fade" data-at="0.24" />

      {/* Delivery — warm light pooled on the stage and the floor, held inside the
          hall; painted under the furniture so labels stay legible */}
      <g clipPath="url(#fp-hall-clip)" style={{ pointerEvents: "none" }}>
        <ellipse
          cx="200"
          cy="52"
          rx="130"
          ry="72"
          fill="url(#fp-warm)"
          className="fx-fade [transition-duration:0.9s]"
          data-at="0.72"
        />
        <ellipse
          cx="200"
          cy="108"
          rx="95"
          ry="62"
          fill="url(#fp-warm)"
          className="fx-fade [transition-duration:0.9s]"
          data-at="0.74"
        />
      </g>

      {/* Discovery — the outline, drawn with scroll */}
      <path
        ref={hallRef}
        d={HALL}
        pathLength={1}
        fill="none"
        stroke="#b08d57"
        strokeWidth="2"
        strokeDasharray="1"
        strokeDashoffset="1"
      />

      {/* Design — stage, dance floor, palette */}
      <g className="fx-pop" data-at="0.28">
        <rect x="130" y="32" width="140" height="32" rx="6" fill="#b08d57" fillOpacity="0.9" />
        <text
          x="200"
          y="51.5"
          textAnchor="middle"
          fontSize="8"
          letterSpacing="2.4"
          fill="#171716"
          fontWeight="600"
        >
          STAGE
        </text>
      </g>
      <g className="fx-pop" data-at="0.33">
        <rect
          x="162"
          y="80"
          width="76"
          height="48"
          rx="4"
          fill="#f2eee6"
          fillOpacity="0.07"
          stroke="#f2eee6"
          strokeOpacity="0.4"
          strokeDasharray="3 3"
        />
        <text
          x="200"
          y="106.5"
          textAnchor="middle"
          fontSize="6.5"
          letterSpacing="1.6"
          fill="#f2eee6"
          fillOpacity="0.6"
        >
          DANCE FLOOR
        </text>
      </g>
      {SWATCHES.map((swatch) => (
        <circle
          key={swatch.x}
          cx={swatch.x}
          cy="264"
          r="6"
          fill={swatch.fill}
          stroke="#171716"
          strokeWidth="1.5"
          className="fx-pop"
          data-at={swatch.at}
        />
      ))}

      {/* Planning — tables drop in; Delivery — their chairs fill */}
      {TABLES.map((table) => (
        <g key={`${table.x}-${table.y}`} className="fx-drop" data-at={table.at}>
          {table.chairs.map((chair) => (
            <g key={`${chair.x}-${chair.y}`}>
              <circle cx={chair.x} cy={chair.y} r="3.3" fill="#f2eee6" fillOpacity="0.2" />
              <circle
                cx={chair.x}
                cy={chair.y}
                r="3.3"
                fill="#d4af7a"
                className="fx-fade"
                data-at={chair.at}
              />
            </g>
          ))}
          <circle
            cx={table.x}
            cy={table.y}
            r="10"
            fill="#26221e"
            stroke="#b08d57"
            strokeOpacity="0.75"
            strokeWidth="1.2"
          />
        </g>
      ))}

      {/* Planning — vendors pinned onto the plan */}
      {TAGS.map((tag) => (
        <g key={tag.label} className="fx-drop" data-at={tag.at}>
          <rect x={tag.x} y={tag.y} width={tag.w} height="16" rx="4" fill="#ffffff" />
          <circle cx={tag.x + 7} cy={tag.y + 8} r="2.4" fill="#8f3b4f" />
          <text x={tag.x + 13} y={tag.y + 11} fontSize="7.5" fontWeight="600" fill="#171716">
            {tag.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
