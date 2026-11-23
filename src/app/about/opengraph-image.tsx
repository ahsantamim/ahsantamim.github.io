import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `About ${site.name}, ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Social sharing preview for /about, generated at build time. */
export default async function OpengraphImage() {
  const portrait = await readFile(join(process.cwd(), "src/app/about/og-portrait.png"));
  const src = `data:image/png;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#080808", color: "#ffffff" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 700,
            padding: 72,
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
          <div style={{ display: "flex", fontSize: 84, lineHeight: 1, letterSpacing: -4 }}>
            I turn ideas into software that ships.
          </div>
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #292929",
              paddingTop: 28,
              fontSize: 26,
              color: "#a1a1aa",
            }}
          >
            {site.title}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", width: 500, height: 630 }}>
          <img src={src} alt="" width={540} height={540} style={{ marginLeft: -40 }} />
        </div>
      </div>
    ),
    size,
  );
}
