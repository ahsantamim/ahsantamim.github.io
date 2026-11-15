import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Social sharing preview, generated at build time. */
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
          padding: 72,
          background: "#080808",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              border: "2px solid #ffffff",
              fontWeight: 700,
            }}
          >
            {site.monogram}
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 1, letterSpacing: -4, maxWidth: 980 }}>
          Engineering ideas into meaningful digital products.
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #292929",
            paddingTop: 28,
            fontSize: 26,
            color: "#a1a1aa",
          }}
        >
          <span>{site.title}</span>
          <span>{site.location} / Working globally</span>
        </div>
      </div>
    ),
    size,
  );
}
