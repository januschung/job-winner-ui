// Prints the ffmpeg filter that cuts the hero recording to its timeline:
// from `start` to `end`, with the `fast` stretches sped up by `speed`.
// Output label: [cut]. Usage: node scripts/hero-filter.mjs timeline.json
import { readFileSync } from 'node:fs';

const { start, end, speed, fast } = JSON.parse(
  readFileSync(process.argv[2], 'utf8')
);

const segments = [];
let at = start;
for (const [from, to] of fast) {
  if (from > at) segments.push([at, from, 1]);
  segments.push([from, to, speed]);
  at = to;
}
if (end > at) segments.push([at, end, 1]);

const parts = segments.map(
  ([from, to, rate], i) =>
    `[0:v]trim=start=${from.toFixed(3)}:end=${to.toFixed(3)},` +
    `setpts=(PTS-STARTPTS)/${rate}[s${i}]`
);
const inputs = segments.map((_, i) => `[s${i}]`).join('');
process.stdout.write(
  `${parts.join(';')};${inputs}concat=n=${segments.length}:v=1:a=0[cut]`
);
