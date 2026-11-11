// Geometry of the hero visual: an abstract network map (nodes + links)
// crossed by one attack path. Deterministic (fixed seed), so every build and
// every export draws exactly the same picture.
// Used by apps/site (NetworkField.astro) and scripts/export-network-field.mjs.

export const WIDTH = 800;
export const HEIGHT = 800;
const COLS = 9;
const ROWS = 9;
const PATH_CELLS = [[1, 7], [2, 6], [3, 6], [4, 5], [5, 4], [5, 3], [6, 2], [7, 2]];

/** Small deterministic PRNG (mulberry32). */
function createRandom(seed) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createNetworkField(seed = 0x4a4c /* "JL" */) {
  const rand = createRandom(seed);

  const nodes = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      nodes.push({
        x: ((col + 0.5) / COLS) * WIDTH + (rand() - 0.5) * 70,
        y: ((row + 0.5) / ROWS) * HEIGHT + (rand() - 0.5) * 70,
        r: rand() < 0.15 ? 3.2 : 1.8,
      });
    }
  }
  const at = (col, row) => nodes[row * COLS + col];

  // Links: right and down neighbours, plus some diagonals; a few are skipped.
  const links = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const n = at(col, row);
      if (col < COLS - 1 && rand() > 0.18) links.push({ a: n, b: at(col + 1, row), o: 0.25 + rand() * 0.5 });
      if (row < ROWS - 1 && rand() > 0.18) links.push({ a: n, b: at(col, row + 1), o: 0.25 + rand() * 0.5 });
      if (col < COLS - 1 && row < ROWS - 1 && rand() > 0.72)
        links.push({ a: n, b: at(col + 1, row + 1), o: 0.2 + rand() * 0.3 });
    }
  }

  // The attack path: from an entry point (bottom left) to a target (top right).
  const path = PATH_CELLS.map(([col, row]) => at(col, row));
  const pathD = path.map((n, i) => `${i ? 'L' : 'M'}${n.x.toFixed(1)} ${n.y.toFixed(1)}`).join(' ');

  return { width: WIDTH, height: HEIGHT, nodes, links, path, pathD, entry: path[0], target: path[path.length - 1] };
}
