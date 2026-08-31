This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Media assets

### The event-management hero film

`public/HERO-web.mp4` (2.8MB) is what the site ships. It is an encode, not the
original — the master is a 3840x2160 h264 at 36 Mbps, 34.6MB for eight seconds
of muted footage that plays behind a heavy scrim. Keeping that in `public/` put
34.6MB of unused weight into every deploy, so it is deliberately **not** in this
repo.

The master lives outside the repo at `C:\Users\ELITEBOOK MT45\HERO-master-backup.mp4`.
Move it somewhere durable (and off this one machine) if it is the only copy.

To re-cut the film from a new master:

```bash
ffmpeg -i HERO.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 30 -preset slow \
  -profile:v high -pix_fmt yuv420p -an -movflags +faststart \
  -y public/HERO-web.mp4
```

- `-an` drops the audio track. The hero is muted, so it is dead weight.
- `-movflags +faststart` moves the index to the front of the file, so playback
  can begin while the rest is still downloading. This matters as much as size.
- `-crf 30` is the quality dial: lower is better and larger, higher is worse and
  smaller. Behind the hero's scrim, 30 is indistinguishable from the master.

Re-cut the poster to match, or the first paint shows a frame from the old film:

```bash
ffmpeg -i public/HERO-web.mp4 -ss 0.12 -frames:v 1 -q:v 2 -y public/hero-poster.jpg
```
