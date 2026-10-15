import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento: foto, título, o nome grande e a frase. */
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "assets/foto-og.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fafafa",
          color: "#000",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={132} height={132} alt="" style={{ borderRadius: 999 }} />
          <div style={{ fontSize: 28, letterSpacing: 2, color: "#646464", textTransform: "uppercase" }}>{profile.title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -6, lineHeight: 0.9, textTransform: "uppercase" }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 32, marginTop: 32, maxWidth: 960, lineHeight: 1.3 }}>{profile.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
