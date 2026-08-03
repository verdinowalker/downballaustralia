import { ImageResponse } from "next/og";

export const alt = "Downball Australia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#080808", color: "white", display: "flex", height: "100%", justifyContent: "center", position: "relative", width: "100%" }}>
      <div style={{ background: "#f5c518", height: 14, left: 0, position: "absolute", right: 0, top: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", padding: 70, width: "100%" }}>
        <span style={{ color: "#f5c518", fontSize: 28, letterSpacing: 8, textTransform: "uppercase" }}>The official competition platform</span>
        <strong style={{ fontSize: 104, lineHeight: .92, marginTop: 32, textTransform: "uppercase" }}>Downball<br />Australia</strong>
        <span style={{ color: "#aaa", fontSize: 31, marginTop: 35 }}>News · Teams · Fixtures · Results · Standings</span>
      </div>
    </div>,
    size
  );
}
