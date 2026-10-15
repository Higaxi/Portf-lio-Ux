import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento: o nome grande, o título e a frase, em preto e branco. */
export default function OpengraphImage() {
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
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, color: "#646464", textTransform: "uppercase" }}>
          {profile.title}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 0.9, textTransform: "uppercase" }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 34, marginTop: 36, maxWidth: 900, lineHeight: 1.3 }}>{profile.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
