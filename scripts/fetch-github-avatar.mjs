// Downloads the GitHub profile photo into src/assets so it is bundled and
// optimized by astro:assets at build time (no request to GitHub at runtime).
// Usage: npm run avatar:fetch [-- <github-username>]
import { writeFile } from 'node:fs/promises';

const username = process.argv[2] ?? 'djolaq';
const size = 460;
const target = new URL('../src/assets/avatar.jpg', import.meta.url);

const res = await fetch(`https://github.com/${username}.png?size=${size}`);
if (!res.ok) {
  console.error(`Failed to fetch avatar for "${username}": ${res.status} ${res.statusText}`);
  process.exit(1);
}

await writeFile(target, Buffer.from(await res.arrayBuffer()));
console.log(`Saved ${username}'s GitHub avatar to src/assets/avatar.jpg`);
