import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The share image for every page that doesn't set its own: the Ticket Producer
 * wordmark (the two-line lockup with its rule, as in components/brand/logo.tsx)
 * over a darkened Broadway marquee at night. Built at build time.
 *
 * The photograph is the landing reel's Times Square crop — Wikimedia Commons,
 * CC BY-SA 4.0, credited on /credits.
 */

export const alt = "Ticket Producer — Broadway tickets and live events, New York";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/broadway/times-square.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", background: "#0a0a0b" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img
          src={src}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.42 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(10,10,11,0.96) 0%, rgba(10,10,11,0.75) 55%, rgba(10,10,11,0.35) 100%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 96px" }}>
          {/* The lockup */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "flex-start" }}>
            <div style={{ fontSize: 76, letterSpacing: 18, color: "#ffffff", fontWeight: 300 }}>TICKET</div>
            <div style={{ width: "100%", height: 2, background: "#ffffff", opacity: 0.8, margin: "14px 0" }} />
            <div style={{ fontSize: 76, letterSpacing: 12, color: "#ffffff", fontWeight: 300 }}>PRODUCER</div>
          </div>

          <div style={{ marginTop: 56, fontSize: 40, color: "#ffffff", fontWeight: 600, maxWidth: 760, lineHeight: 1.15 }}>
            Broadway tickets and live events, produced properly.
          </div>
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", fontSize: 24, color: "rgba(255,255,255,0.65)" }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, background: "#5bbd8a", marginRight: 14 }} />
            Verified tickets · Event management · New York
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
