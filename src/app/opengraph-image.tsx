import { ImageResponse } from "next/og";

import { LOGO_SILHOUETTE, LOGO_UNDERLINE, LOGO_VIEWBOX } from "@/components/logo/paths";

export const alt = "Staffkey: the right hands for every hotel.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "radial-gradient(circle at 85% 10%, rgba(18,63,240,0.55), transparent 55%), radial-gradient(circle at 10% 100%, rgba(217,179,106,0.25), transparent 50%), #07080B",
          color: "#F4EFE7",
        }}
      >
        <svg viewBox={LOGO_VIEWBOX} width={300} height={77}>
          <path d={LOGO_SILHOUETTE} fillRule="evenodd" fill="#FFFFFF" />
          <path d={LOGO_UNDERLINE} fill="#123FF0" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, lineHeight: 1, letterSpacing: -3 }}>The right hands</div>
          <div style={{ fontSize: 104, lineHeight: 1, letterSpacing: -3, color: "#D9B36A" }}>for every hotel.</div>
          <div style={{ marginTop: 28, fontSize: 28, opacity: 0.7 }}>Verified hospitality candidates, live across India.</div>
        </div>
      </div>
    ),
    size
  );
}
