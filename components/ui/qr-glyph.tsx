/**
 * A decorative QR code: the real anatomy of a version-2 code (25×25 modules,
 * three finder squares, timing lines, an alignment square) filled with seeded
 * noise. It looks like a ticket's entry code but deliberately encodes nothing,
 * so a phone pointed at a mock-up never opens anything.
 *
 * Built once per seed at module level and drawn as a single SVG path, so it
 * costs one element however many modules it has.
 */

const SIZE = 25;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPath(seed: number) {
  const grid: (boolean | null)[][] = Array.from({ length: SIZE }, () => Array<boolean | null>(SIZE).fill(null));

  const square = (top: number, left: number, size: number) => {
    for (let r = -1; r <= size; r++) {
      for (let c = -1; c <= size; c++) {
        const y = top + r;
        const x = left + c;
        if (y < 0 || x < 0 || y >= SIZE || x >= SIZE) continue;
        const ring = Math.max(Math.abs(r - (size - 1) / 2), Math.abs(c - (size - 1) / 2));
        // size 7: dark outer ring, light ring, dark 3×3 core; -1/size is the light separator
        if (r === -1 || c === -1 || r === size || c === size) grid[y][x] = false;
        else grid[y][x] = ring !== (size - 1) / 2 - 1;
      }
    }
  };

  square(0, 0, 7);
  square(0, SIZE - 7, 7);
  square(SIZE - 7, 0, 7);
  // Alignment pattern: 5×5, dark ring, light ring, dark centre.
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const ring = Math.max(Math.abs(r - 2), Math.abs(c - 2));
      grid[16 + r][16 + c] = ring !== 1;
    }
  }
  // Timing lines between the finders.
  for (let i = 8; i < SIZE - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  const rand = mulberry32(seed);
  let d = "";
  for (let y = 0; y < SIZE; y++) {
    let run = -1;
    for (let x = 0; x <= SIZE; x++) {
      const on = x < SIZE && (grid[y][x] ?? rand() > 0.52);
      if (on && run < 0) run = x;
      if (!on && run >= 0) {
        d += `M${run} ${y}h${x - run}v1h${run - x}z`;
        run = -1;
      }
    }
  }
  return d;
}

const cache = new Map<number, string>();

export function QrGlyph({ seed = 4821, className }: { seed?: number; className?: string }) {
  let d = cache.get(seed);
  if (!d) {
    d = buildPath(seed);
    cache.set(seed, d);
  }
  return (
    <svg
      viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}
