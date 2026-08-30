import { clsx } from "@/lib/clsx";

/*
 * Art direction is drawn, not photographed: hairline architectural linework
 * standing in for the world behind live events — a proscenium, tiered seating,
 * a lighting grid. Swap in commissioned photography behind these if it lands.
 */

/** Proscenium arch with a perspective floor and lighting battens. Hero ground. */
export function ProsceniumArt({ className }: { className?: string }) {
  const vanishX = 800;
  const vanishY = 470;
  // Irregular spacing on purpose — even intervals read as a barcode.
  const floorOrigins = [-140, 90, 268, 512, 800, 1088, 1332, 1510, 1740];
  const battens = [186, 232, 296];

  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMax slice"
      className={clsx("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="tp-arch-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2eee6" stopOpacity="0.34" />
          <stop offset="52%" stopColor="#f2eee6" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f2eee6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tp-floor-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#a4855a" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#a4855a" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#a4855a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Perspective floor converging under the arch */}
      <g stroke="url(#tp-floor-fade)" strokeWidth="1" fill="none">
        {floorOrigins.map((x) => (
          <line key={x} x1={x} y1="1000" x2={vanishX} y2={vanishY} />
        ))}
        <path d="M 120 862 H 1480" opacity="0.5" />
        <path d="M 300 726 H 1300" opacity="0.36" />
        <path d="M 430 630 H 1170" opacity="0.24" />
      </g>

      {/* Nested proscenium arches */}
      <g stroke="url(#tp-arch-fade)" fill="none">
        <path
          d="M 292 1000 V 392 C 292 196 520 148 800 148 C 1080 148 1308 196 1308 392 V 1000"
          strokeWidth="1.25"
        />
        <path
          d="M 336 1000 V 400 C 336 226 546 184 800 184 C 1054 184 1264 226 1264 400 V 1000"
          strokeWidth="1"
          opacity="0.62"
        />
        <path
          d="M 380 1000 V 408 C 380 256 572 220 800 220 C 1028 220 1220 256 1220 408 V 1000"
          strokeWidth="1"
          opacity="0.34"
        />
      </g>

      {/* Lighting battens with irregular hangs */}
      <g stroke="#f2eee6" strokeWidth="1" opacity="0.1">
        {battens.map((y, row) => (
          <g key={y}>
            <line x1="392" y1={y} x2="1208" y2={y} />
            {[452, 596, 700, 848, 962, 1108].map((x, i) => (
              <line
                key={x}
                x1={x + row * 18}
                y1={y}
                x2={x + row * 18}
                y2={y + (i % 2 === 0 ? 14 : 9)}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Tiered seating geometry, abstracted to arcs. Operational precision. */
export function TieredArcs({ className }: { className?: string }) {
  const tiers = [
    { r: 148, o: 0.5 },
    { r: 226, o: 0.4 },
    { r: 304, o: 0.32 },
    { r: 382, o: 0.24 },
    { r: 460, o: 0.16 },
    { r: 538, o: 0.1 },
  ];

  return (
    <svg
      aria-hidden
      viewBox="0 0 700 620"
      preserveAspectRatio="xMidYMid meet"
      className={clsx("h-full w-full", className)}
    >
      <g
        fill="none"
        stroke="#a4855a"
        strokeWidth="1"
        transform="translate(350 96)"
      >
        {tiers.map(({ r, o }) => (
          <path
            key={r}
            d={`M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0`}
            opacity={o}
          />
        ))}
      </g>
      {/* Radial aisles — three, off-center, so it reads as a plan drawing */}
      <g
        stroke="#f2eee6"
        strokeWidth="1"
        opacity="0.09"
        transform="translate(350 96)"
      >
        <line x1="0" y1="120" x2="0" y2="540" />
        <line x1="-96" y1="112" x2="-388" y2="452" />
        <line x1="96" y1="112" x2="388" y2="452" />
      </g>
      {/* Stage edge */}
      <line
        x1="222"
        y1="96"
        x2="478"
        y2="96"
        stroke="#c0a479"
        strokeWidth="1"
        opacity="0.55"
      />
    </svg>
  );
}

/** Structural lattice — infrastructure and market depth, never a chart. */
export function MarketLattice({ className }: { className?: string }) {
  const columns = [0, 88, 176, 264, 352, 440, 528, 616, 704];
  const rows = [0, 74, 148, 222, 296, 370, 444];
  // Deterministic heights: a load-bearing frame, not data.
  const risers = [0.34, 0.72, 0.48, 0.9, 0.62, 0.28, 0.8, 0.54, 0.4];

  return (
    <svg
      aria-hidden
      viewBox="0 0 704 444"
      preserveAspectRatio="none"
      className={clsx("h-full w-full", className)}
    >
      <g stroke="#f2eee6" strokeWidth="1" opacity="0.07">
        {columns.map((x) => (
          <line key={`c${x}`} x1={x} y1="0" x2={x} y2="444" />
        ))}
        {rows.map((y) => (
          <line key={`r${y}`} x1="0" y1={y} x2="704" y2={y} />
        ))}
      </g>
      <g stroke="#a4855a" strokeWidth="1.5" opacity="0.34">
        {columns.map((x, i) => (
          <line
            key={`v${x}`}
            x1={x}
            y1={444}
            x2={x}
            y2={444 - 444 * risers[i]}
          />
        ))}
      </g>
    </svg>
  );
}

/** Colonnade rhythm for the entry screen — a facade, seen at dusk. */
export function ColonnadeArt({ className }: { className?: string }) {
  // Irregular bay widths, as a real facade has.
  const bays = [148, 342, 512, 728, 900, 1096, 1288, 1452];

  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={clsx("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="tp-col-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2eee6" stopOpacity="0" />
          <stop offset="30%" stopColor="#f2eee6" stopOpacity="0.4" />
          <stop offset="72%" stopColor="#f2eee6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f2eee6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tp-col-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a4855a" stopOpacity="0" />
          <stop offset="46%" stopColor="#a4855a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a4855a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#tp-col-fade)" fill="none" strokeWidth="1">
        {bays.map((x, i) => (
          <g key={x}>
            <line x1={x} y1="152" x2={x} y2="748" />
            <path
              d={`M ${x} 152 C ${x} 96 ${x + (i % 2 ? 62 : 78)} 96 ${
                x + (i % 2 ? 124 : 156)
              } 152`}
              opacity="0.7"
            />
          </g>
        ))}
        <line x1="0" y1="748" x2="1600" y2="748" opacity="0.8" />
        <line x1="0" y1="128" x2="1600" y2="128" opacity="0.5" />
      </g>
      {/* A single brass reveal line where the light catches the stone */}
      <line
        x1="0"
        y1="152"
        x2="1600"
        y2="152"
        stroke="url(#tp-col-brass)"
        strokeWidth="1"
      />
    </svg>
  );
}
